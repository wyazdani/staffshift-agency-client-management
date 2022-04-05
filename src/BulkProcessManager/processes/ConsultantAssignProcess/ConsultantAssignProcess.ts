import {LoggerContext} from 'a24-logzio-winston';
import {ValidationError, ResourceNotFoundError} from 'a24-node-error-utils';
import {ConsultantJobAssignInitiatedEventStoreDataInterface} from 'EventTypes';
import {difference} from 'lodash';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {ConsultantJobAggregateIdInterface} from '../../../aggregates/ConsultantJob/types';
import {ConsultantJobAssignAggregateStatusEnum} from '../../../aggregates/ConsultantJobAssign/types/ConsultantJobAssignAggregateStatusEnum';
import {SequenceIdMismatch} from '../../../errors/SequenceIdMismatch';
import {EventRepository} from '../../../EventRepository';
import {EventStore} from '../../../models/EventStore';
import {EventStoreErrorEncoder} from '../../EventStoreErrorEncoder';
import {RetryService, RetryableError, NonRetryableError} from '../../RetryService';
import {ProcessInterface} from '../../types/ProcessInterface';
import {EventStoreHelper} from './EventStoreHelper';

interface ConsultantAssignProcessOptsInterface {
  maxRetry: number;
  retryDelay: number;
}

/**
 * It handles bulk consultant assign to client
 * It has a for loop to iterate through all clients. In each loop it
 * generates start/item_succeeded/item_failed/completed events on ConsultantJobAssign aggregate
 * also it assigns clients to consultant one by one
 * during each assignment business/internal errors might happen. we might do retry(based on error type),
 * otherwise mark it as failure and move on
 */
export class ConsultantAssignProcess implements ProcessInterface {
  private initiateEvent: EventStorePubSubModelInterface<
    ConsultantJobAssignInitiatedEventStoreDataInterface,
    ConsultantJobAggregateIdInterface
  >;
  private eventStoreHelper: EventStoreHelper;
  constructor(private logger: LoggerContext, private opts: ConsultantAssignProcessOptsInterface) {}

  async execute(
    initiateEvent: EventStorePubSubModelInterface<
      ConsultantJobAssignInitiatedEventStoreDataInterface,
      ConsultantJobAggregateIdInterface
    >
  ): Promise<void> {
    this.initiateEvent = initiateEvent;
    const eventId = initiateEvent._id;

    this.logger.info('Consultant Assign background process started', {eventId});
    const eventRepository = new EventRepository(
      EventStore,
      initiateEvent.correlation_id,
      initiateEvent.meta_data,
      eventId
    );

    this.eventStoreHelper = new EventStoreHelper(
      initiateEvent.aggregate_id.agency_id,
      initiateEvent.data._id,
      eventRepository
    );

    const jobAssignAggregate = await this.eventStoreHelper.getConsultantJobAssignAggregate(
      this.initiateEvent.aggregate_id.agency_id,
      initiateEvent.data._id
    );
    const currentStatus = jobAssignAggregate.getCurrentStatus();

    if (currentStatus === ConsultantJobAssignAggregateStatusEnum.NEW) {
      await this.eventStoreHelper.startProcess();
    } else if (currentStatus === ConsultantJobAssignAggregateStatusEnum.COMPLETED) {
      this.logger.info('Consultant Assignment process already completed', {id: initiateEvent._id});
      return;
    }
    const processedClientIds = jobAssignAggregate.getProgressedClientIds();
    const clientIds = difference(initiateEvent.data.client_ids, processedClientIds);

    for (const clientId of clientIds) {
      if (await this.assignClientWithRetry(clientId)) {
        this.logger.info(`Assigned client ${clientId} to consultant ${this.initiateEvent.data.consultant_id}`);
        await this.eventStoreHelper.succeedItemProcess(clientId);
      }
    }
    await this.eventStoreHelper.completeProcess();
    this.logger.info('Consultant Assign background process finished', {eventId});
  }

  private async assignClientWithRetry(clientId: string): Promise<boolean> {
    const retryService = new RetryService(this.opts.maxRetry, this.opts.retryDelay);

    try {
      await retryService.exec(() => this.assignClient(clientId));
      return true;
    } catch (error) {
      await this.eventStoreHelper.failItemProcess(
        clientId,
        EventStoreErrorEncoder.encodeArray(retryService.getErrors())
      );
      return false;
    }
  }

  /**
   * Assigning client to consultant and deciding to do retry or not
   */
  private async assignClient(clientId: string): Promise<void> {
    try {
      this.logger.debug('Assigning consultant to client', {
        clientId,
        consultantId: this.initiateEvent.data.consultant_id
      });
      await this.eventStoreHelper.assignConsultantToClient(
        this.initiateEvent.data.consultant_role_id,
        this.initiateEvent.data.consultant_id,
        clientId
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
        this.logger.debug('Assigning consultant to client was not possible due to business validation', error);
        throw new NonRetryableError(error);
      } else {
        this.logger.error('Unknown error occurred during assigning consultant to client', error);
        throw new RetryableError(error);
      }
    }
  }

  async complete(): Promise<void> {
    await this.eventStoreHelper.completeConsultantJob(
      this.initiateEvent.aggregate_id.agency_id,
      this.initiateEvent.data._id
    );
  }
}
