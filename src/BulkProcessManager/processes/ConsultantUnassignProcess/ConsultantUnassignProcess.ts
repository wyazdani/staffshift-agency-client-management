import {LoggerContext} from 'a24-logzio-winston';
import {ValidationError, ResourceNotFoundError} from 'a24-node-error-utils';
import {
  ConsultantJobAssignInitiatedEventStoreDataInterface,
  ConsultantJobUnassignInitiatedEventStoreDataInterface
} from 'EventTypes';
import {differenceWith} from 'lodash';
import {LeanDocument} from 'mongoose';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {ConsultantJobAggregateIdInterface} from '../../../aggregates/ConsultantJob/types';
import {ConsultantJobProcessAggregateStatusEnum} from '../../../aggregates/ConsultantJobProcess/types/ConsultantJobProcessAggregateStatusEnum';
import {SequenceIdMismatch} from '../../../errors/SequenceIdMismatch';
import {EventRepository} from '../../../EventRepository';
import {
  AgencyClientConsultantsProjectionV3,
  AgencyClientConsultantV3DocumentType
} from '../../../models/AgencyClientConsultantsProjectionV3';
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

type AssignmentItemType = Pick<AgencyClientConsultantV3DocumentType, '_id' | 'client_id' | 'consultant_role_id'>;

/**
 * It handles bulk consultant unassign from multiple clients
 * We query on Projection records to find the assignment records
 * It has a for loop to iterate through all assignment. In each loop it
 * generates start/item_succeeded/item_failed/completed events on ConsultantJobProcess aggregate
 * during each unassign business/internal errors might happen. we might do retry(based on error type),
 * otherwise mark it as failure and move on
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
    const progressedItems = jobProcessAggregate.getProgressedItems();
    const assignments = await this.getClientAssignments();
    const clientAssignments = differenceWith(
      assignments,
      progressedItems,
      (itemA, itemB) => itemA.client_id === itemB.client_id && itemA.consultant_role_id === itemB.consultant_role_id
    );

    for (const assignment of clientAssignments) {
      this.logger.debug(`Unassigning client ${assignment.client_id} with role id ${assignment.consultant_role_id}`);
      if (await this.unassignClientWithRetry(assignment)) {
        this.logger.info(
          `Unassigned client ${assignment.client_id} from consultant ${this.initiateEvent.data.consultant_id} with role id ${assignment.consultant_role_id}`
        );
        await this.commandBus.succeedItemConsultantJobProcess(this.consultantJobProcessCommandAggregateId, {
          client_id: assignment.client_id,
          consultant_role_id: assignment.consultant_role_id
        });
      }
    }
    await this.commandBus.completeConsultantJobProcess(this.consultantJobProcessCommandAggregateId);
    this.logger.info('Consultant Unassign background process finished', {eventId});
  }

  /**
   * unassigning client from consultant and deciding to do retry or not
   */
  private async unassignClientWithRetry(assignment: AssignmentItemType): Promise<boolean> {
    const retryService = new RetryService(this.opts.maxRetry, this.opts.retryDelay);

    try {
      await retryService.exec(() => this.unassignClient(assignment));
      return true;
    } catch (error) {
      await this.commandBus.failItemConsultantJobProcess(this.consultantJobProcessCommandAggregateId, {
        client_id: assignment.client_id,
        consultant_role_id: assignment.consultant_role_id,
        errors: EventStoreErrorEncoder.encodeArray(retryService.getErrors())
      });
      return false;
    }
  }
  private async unassignClient(assignment: AssignmentItemType): Promise<void> {
    try {
      this.logger.debug('Unassigning client from consultant', {
        clientId: assignment.client_id,
        _id: assignment._id,
        consultantRoleId: assignment.consultant_role_id
      });
      await this.commandBus.removeAgencyClientConsultant(
        {
          agency_id: this.initiateEvent.aggregate_id.agency_id,
          client_id: assignment.client_id
        },
        assignment._id.toString()
      );
    } catch (error) {
      if (error instanceof SequenceIdMismatch) {
        // You might need to reload the aggregate for retry
        this.logger.notice('Sequence id mismatch happened. we try to retry again', {
          initiateEvent: this.initiateEvent._id,
          clientId: assignment.client_id,
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

  /**
   * We query on projections to find the target
   * we already have an index on consultant_id which makes this query fast enough
   *
   */
  private async getClientAssignments(): Promise<LeanDocument<AssignmentItemType>[]> {
    return await AgencyClientConsultantsProjectionV3.find(
      {
        consultant_id: this.initiateEvent.data.consultant_id,
        agency_id: this.initiateEvent.aggregate_id.agency_id,
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
        consultant_id: 1,
        consultant_role_id: 1
      }
    )
      .lean()
      .exec();
  }

  /**
   * it will be called when process is finished
   */
  async complete(): Promise<void> {
    await this.commandBus.completeUnassignConsultant(this.consultantJobCommandAggregateId, this.initiateEvent.data._id);
  }
}
