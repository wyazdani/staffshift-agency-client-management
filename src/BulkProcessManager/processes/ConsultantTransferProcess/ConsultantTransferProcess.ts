import {LoggerContext} from 'a24-logzio-winston';
import {ValidationError, ResourceNotFoundError} from 'a24-node-error-utils';
import {ConsultantJobTransferInitiatedEventStoreDataInterface} from 'EventTypes';
import {differenceWith} from 'lodash';
import {ObjectID} from 'mongodb';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {ConsultantJobAggregateIdInterface} from '../../../aggregates/ConsultantJob/types';
import {ConsultantJobProcessAggregateStatusEnum} from '../../../aggregates/ConsultantJobProcess/types/ConsultantJobProcessAggregateStatusEnum';
import {SequenceIdMismatch} from '../../../errors/SequenceIdMismatch';
import {EventRepository} from '../../../EventRepository';
import {EventStore} from '../../../models/EventStore';
import {EventStoreErrorEncoder} from '../../EventStoreErrorEncoder';
import {RetryService, RetryableError, NonRetryableError} from '../../RetryService';
import {ProcessInterface} from '../../types/ProcessInterface';
import {CommandBus} from '../../../aggregates/CommandBus';

import {ConsultantJobProcessAggregateIdInterface} from '../../../aggregates/ConsultantJobProcess/types';
import {ConsultantJobProcessRepository} from '../../../aggregates/ConsultantJobProcess/ConsultantJobProcessRepository';
import {ConsultantJobProcessWriteProjectionHandler} from '../../../aggregates/ConsultantJobProcess/ConsultantJobProcessWriteProjectionHandler';
import {ClientConsultantAssignments, AssignmentItemType} from './ClientConsultantAssignments';

interface ConsultantTransferProcessOptsInterface {
  maxRetry: number;
  retryDelay: number;
}

/**
 * @TODO
 */
export class ConsultantTransferProcess implements ProcessInterface {
  private initiateEvent: EventStorePubSubModelInterface<
    ConsultantJobTransferInitiatedEventStoreDataInterface,
    ConsultantJobAggregateIdInterface
  >;
  private commandBus: CommandBus;
  private consultantJobProcessCommandAggregateId: ConsultantJobProcessAggregateIdInterface;
  private consultantJobCommandAggregateId: ConsultantJobAggregateIdInterface;
  private consultantJobProcessRepository: ConsultantJobProcessRepository;
  constructor(private logger: LoggerContext, private opts: ConsultantTransferProcessOptsInterface) {}

  async execute(
    initiateEvent: EventStorePubSubModelInterface<
      ConsultantJobTransferInitiatedEventStoreDataInterface,
      ConsultantJobAggregateIdInterface
    >
  ): Promise<void> {
    this.initiateEvent = initiateEvent;
    const eventId = initiateEvent._id;

    this.logger.info('Consultant Transfer background process started', {eventId});
    const eventRepository = new EventRepository(
      EventStore,
      initiateEvent.correlation_id,
      initiateEvent.meta_data,
      eventId
    );
    const clientAssignments = ClientConsultantAssignments.createInstance(this.initiateEvent);

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
      await this.commandBus.startConsultantJobProcess(
        this.consultantJobProcessCommandAggregateId,
        await clientAssignments.getEstimatedCount()
      );
    } else if (currentStatus === ConsultantJobProcessAggregateStatusEnum.COMPLETED) {
      this.logger.info('Consultant Transfer process already completed', {id: initiateEvent._id});
      return;
    }
    const progressedItems = jobProcessAggregate.getProgressedItems();
    const projectionAssignments = await clientAssignments.getClientConsultantAssignments();
    const assignments = differenceWith(
      projectionAssignments,
      progressedItems,
      (itemA, itemB) => itemA.client_id === itemB.client_id && itemA.consultant_role_id === itemB.consultant_role_id
    );

    for (const assignment of assignments) {
      this.logger.debug(`Transferring client ${assignment.client_id} with role id ${assignment.consultant_role_id}`);
      if (await this.transferClientWithRetry(assignment)) {
        this.logger.info(
          `Transferred client ${assignment.client_id} from consultant ${this.initiateEvent.data.from_consultant_id} with role id ${assignment.consultant_role_id} to consultant ${this.initiateEvent.data.to_consultant_id}`
        );
        await this.commandBus.succeedItemConsultantJobProcess(this.consultantJobProcessCommandAggregateId, {
          client_id: assignment.client_id,
          consultant_role_id: assignment.consultant_role_id
        });
      }
    }
    await this.commandBus.completeConsultantJobProcess(this.consultantJobProcessCommandAggregateId);
    this.logger.info('Consultant Transfer background process finished', {eventId});
  }

  /**
   * transferring client from consultant and deciding to do retry or not
   */
  private async transferClientWithRetry(assignment: AssignmentItemType): Promise<boolean> {
    const retryService = new RetryService(this.opts.maxRetry, this.opts.retryDelay);

    try {
      await retryService.exec(() => this.transferClient(assignment));
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
  private async transferClient(assignment: AssignmentItemType): Promise<void> {
    try {
      this.logger.debug('Transferring client from consultant', {
        clientId: assignment.client_id,
        _id: assignment._id,
        consultantRoleId: assignment.consultant_role_id
      });
      await this.commandBus.transferAgencyClientConsultant(
        {
          agency_id: this.initiateEvent.aggregate_id.agency_id,
          client_id: assignment.client_id
        },
        {
          from_id: assignment._id.toString(),
          to_consultant_id: '', // @TODO
          to_consultant_role_id: '', // @TODO
          to_id: new ObjectID().toString()
        }
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
        this.logger.debug('Transferring clients was not possible due to business validation', error);
        throw new NonRetryableError(error);
      } else {
        this.logger.error('Unknown error occurred during Transferring clients of consultant', error);
        throw new RetryableError(error);
      }
    }
  }

  /**
   * it will be called when process is finished
   */
  async complete(): Promise<void> {
    await this.commandBus.completeTransferConsultant(this.consultantJobCommandAggregateId, this.initiateEvent.data._id);
  }
}
