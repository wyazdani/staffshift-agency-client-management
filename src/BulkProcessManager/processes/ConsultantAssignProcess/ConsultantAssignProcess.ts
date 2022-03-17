import {LoggerContext} from 'a24-logzio-winston';
import {ValidationError, ResourceNotFoundError} from 'a24-node-error-utils';
import retry from 'async-retry';
import {ConsultantJobAssignInitiatedEventStoreDataInterface} from 'EventStoreDataTypes';
import {EventStoreEncodedErrorInterface} from 'EventStoreEncodedErrorInterface';
import {map, get, difference} from 'lodash';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {ConsultantJobAggregateIdInterface} from '../../../aggregates/ConsultantJob/types';
import {ConsultantJobAssignRepository} from '../../../aggregates/ConsultantJobAssign/ConsultantJobAssignRepository';
import {ConsultantJobAssignWriteProjectionHandler} from '../../../aggregates/ConsultantJobAssign/ConsultantJobAssignWriteProjectionHandler';
import {ConsultantJobAssignAggregateStatusEnum} from '../../../aggregates/ConsultantJobAssign/types/ConsultantJobAssignAggregateStatusEnum';
import {SequenceIdMismatch} from '../../../errors/SequenceIdMismatch';
import {EventRepository} from '../../../EventRepository';
import {EventStore} from '../../../models/EventStore';
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
    const consultantJobAssignRepository = new ConsultantJobAssignRepository(
      eventRepository,
      new ConsultantJobAssignWriteProjectionHandler()
    );
    const jobAssignAggregate = await consultantJobAssignRepository.getAggregate(
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

  /**
   * Assigning client to consultant with supporting the retry functionality
   */
  private async assignClientWithRetry(clientId: string): Promise<boolean> {
    const errors: Error[] = [];

    try {
      await retry(
        async (bail) => {
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
            errors.push(error);
            let retry = true;

            if (error instanceof SequenceIdMismatch) {
              // You might need to reload the aggregate for retry
              this.logger.notice('Sequence id mismatch happened. we try to retry again', {
                initiateEvent: this.initiateEvent._id,
                clientId: clientId,
                error
              });
            } else if (error instanceof ValidationError || error instanceof ResourceNotFoundError) {
              // non-retryable errors
              this.logger.info('Assigning consultant to client was not possible due to business validation', error);
              retry = false;
            } else {
              this.logger.error('Unknown error occurred during assigning consultant to client', error);
            }
            if (retry) {
              throw error;
            } else {
              bail(error); // bail causes not to do any retry
            }
          }
        },
        {
          retries: this.opts.maxRetry,
          factor: 1,
          minTimeout: this.opts.retryDelay
        }
      );
      return true;
    } catch (error) {
      await this.eventStoreHelper.failItemProcess(clientId, this.encodeErrors(errors));
      return false;
    }
  }

  /**
   * transforms error array object to be able to save it under EventStore
   */
  private encodeErrors(errors: Error[]): EventStoreEncodedErrorInterface[] {
    return map(errors, (error) => ({
      code: get(error, 'code') || 'UNKNOWN_ERROR',
      message: error.message
    }));
  }
}
