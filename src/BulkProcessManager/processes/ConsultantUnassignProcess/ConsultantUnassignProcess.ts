import {LoggerContext} from 'a24-logzio-winston';
import {ValidationError, ResourceNotFoundError} from 'a24-node-error-utils';
import {
  ConsultantJobAssignInitiatedEventStoreDataInterface,
  ConsultantJobUnassignInitiatedEventStoreDataInterface
} from 'EventTypes';
import {difference, assignWith} from 'lodash';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {ConsultantJobAggregateIdInterface} from '../../../aggregates/ConsultantJob/types';
import {ConsultantJobProcessAggregateStatusEnum} from '../../../aggregates/ConsultantJobProcess/types/ConsultantJobProcessAggregateStatusEnum';
import {SequenceIdMismatch} from '../../../errors/SequenceIdMismatch';
import {EventRepository} from '../../../EventRepository';
import {AgencyClientConsultantsProjectionV3} from '../../../models/AgencyClientConsultantsProjectionV3';
import {EventStore} from '../../../models/EventStore';
import {EventStoreErrorEncoder} from '../../EventStoreErrorEncoder';
import {RetryService, RetryableError, NonRetryableError} from '../../RetryService';
import {ProcessInterface} from '../../types/ProcessInterface';
import {CommandBus} from '../../../aggregates/CommandBus';

import {ConsultantJobProcessAggregateIdInterface} from '../../../aggregates/ConsultantJobProcess/types';
import {ConsultantJobProcessRepository} from '../../../aggregates/ConsultantJobProcess/ConsultantJobProcessRepository';
import {ConsultantJobProcessWriteProjectionHandler} from '../../../aggregates/ConsultantJobProcess/ConsultantJobProcessWriteProjectionHandler';

interface ConsultantUnassignProcessOptsInterface {
  maxRetry: number;
  retryDelay: number;
}
interface ConsultantAssignmentInterface {
  assignment_id: string;
  client_id: string;
  consultant_id: string;
}

/**
 * @TODO
 */
export class ConsultantUnassignProcess implements ProcessInterface {
  private initiateEvent: EventStorePubSubModelInterface<
    ConsultantJobUnassignInitiatedEventStoreDataInterface,
    ConsultantJobAggregateIdInterface
  >;
  private commandBus: CommandBus;
  private consultantJobProcessCommandAggregateId: ConsultantJobProcessAggregateIdInterface;
  private consultantJobCommandAggregateId: ConsultantJobAggregateIdInterface;
  private consultantJobProcessRepository: ConsultantJobProcessRepository;
  constructor(private logger: LoggerContext, private opts: ConsultantUnassignProcessOptsInterface) {}

  async execute(
    initiateEvent: EventStorePubSubModelInterface<
      ConsultantJobUnassignInitiatedEventStoreDataInterface,
      ConsultantJobAggregateIdInterface
    >
  ): Promise<void> {
    this.initiateEvent = initiateEvent;
    const eventId = initiateEvent._id;

    this.logger.info('Consultant Unassign background process started', {eventId});
    const eventRepository = new EventRepository(
      EventStore,
      initiateEvent.correlation_id,
      initiateEvent.meta_data,
      eventId
    );

    this.commandBus = new CommandBus(eventRepository);
    this.consultantJobProcessRepository = new ConsultantJobProcessRepository(
      eventRepository,
      new ConsultantJobProcessWriteProjectionHandler()
    );
    this.consultantJobCommandAggregateId = {
      name: 'consultant_job',
      agency_id: this.initiateEvent.aggregate_id.agency_id
    };
    this.consultantJobProcessCommandAggregateId = {
      name: 'consultant_job_process',
      agency_id: this.initiateEvent.aggregate_id.agency_id,
      job_id: initiateEvent.data._id
    };
    const jobProcessAggregate = await this.consultantJobProcessRepository.getAggregate(
      this.consultantJobProcessCommandAggregateId
    );
    const currentStatus = jobProcessAggregate.getCurrentStatus();

    if (currentStatus === ConsultantJobProcessAggregateStatusEnum.NEW) {
      await this.commandBus.startConsultantJobProcess(this.consultantJobProcessCommandAggregateId);
    } else if (currentStatus === ConsultantJobProcessAggregateStatusEnum.COMPLETED) {
      this.logger.info('Consultant Unassign process already completed', {id: initiateEvent._id});
      return;
    }
    // here we don't need to read already processed ones.
    // since if we already processed some items they most likely would be projected too
    const clientIds: string[] = []; //@TODO run a query to fetch from projection

    for (const clientId of clientIds) {
      if (await this.unassignClientWithRetry(clientId)) {
        this.logger.info(`Unassigned client ${clientId} from consultant ${this.initiateEvent.data.consultant_id}`);
        await this.commandBus.succeedItemConsultantJobProcess(this.consultantJobProcessCommandAggregateId, clientId);
      }
    }
    await this.commandBus.completeConsultantJobProcess(this.consultantJobProcessCommandAggregateId);
    this.logger.info('Consultant Assign background process finished', {eventId});
  }

  /**
   * unassignging client from consultant and deciding to do retry or not
   */
  private async unassignClientWithRetry(clientId: string, assignmentId: string): Promise<void> {
    try {
      this.logger.debug('Unassigning client from consultant', {
        clientId,
        consultantId: this.initiateEvent.data.consultant_id
      });
      await this.commandBus.removeAgencyClientConsultant(
        {
          agency_id: this.initiateEvent.aggregate_id.agency_id,
          client_id: clientId
        },
        assignmentId
      );
    } catch (error) {
      if (error instanceof SequenceIdMismatch) {
        // You might need to reload the aggregate for retry
        this.logger.notice('Sequence id mismatch happened. we try to retry again', {
          initiateEvent: this.initiateEvent._id,
          clientId: clientId,
          error
        });
        throw new RetryableError(error);
      } else if (error instanceof ValidationError || error instanceof ResourceNotFoundError) {
        // non-retryable errors
        this.logger.debug('Unassigning consultant from client was not possible due to business validation', error);
        throw new NonRetryableError(error);
      } else {
        this.logger.error('Unknown error occurred during Unassigning consultant from client', error);
        throw new RetryableError(error);
      }
    }
  }

  private getClientAssignments(): Promise<ConsultantAssignmentInterface[]> {
    return await AgencyClientConsultantsProjectionV3.find(
      {
        consultant_id: this.initiateEvent.data.consultant_id,
        ...(this.initiateEvent.data.client_ids && {
          client_id: {
            $in: this.initiateEvent.data.client_ids
          }
        }),
        ...(this.initiateEvent.data.consultant_role_id && {
          consultant_role_id: this.initiateEvent.data.consultant_role_id
        })
      },
      {
        _id: 1,
        client_id: 1,
        consultant_id: 1
      }
    )
      .lean()
      .exec();
  }

  async complete(): Promise<void> {
    await this.commandBus.completeAssignConsultant(this.consultantJobCommandAggregateId, this.initiateEvent.data._id);
  }
}
