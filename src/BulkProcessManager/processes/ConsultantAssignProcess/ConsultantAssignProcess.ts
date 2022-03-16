import {LoggerContext} from 'a24-logzio-winston';
import {ValidationError, ResourceNotFoundError} from 'a24-node-error-utils';
import {ConsultantJobAssignInitiatedEventStoreDataInterface} from 'EventStoreDataTypes';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {ConsultantJobAggregateIdInterface} from '../../../aggregates/ConsultantJob/types';
import {ConsultantJobAssignErrorItemEnum} from '../../../aggregates/ConsultantJobAssign/types/ConsultantJobAssignErrorItemEnum';
import {SequenceIdMismatch} from '../../../errors/SequenceIdMismatch';
import {EventRepository} from '../../../EventRepository';
import {EventStore} from '../../../models/EventStore';
import {ProcessInterface} from '../../types/ProcessInterface';
import {EventStoreHelper} from './EventStoreHelper';

/**
 * It handles bulk consultant assign to client
 * It has a for loop to iterate through all clients. In each loop it
 * generates start/item_succeeded/item_failed/completed events on ConsultantJobAssign aggregate
 * also it assigns clients to consultant one by one
 * during each assignment business errors might happen. we mark them as item_failed events and move on.
 */
export class ConsultantAssignProcess implements ProcessInterface {
  private initiateEvent: EventStorePubSubModelInterface<
    ConsultantJobAssignInitiatedEventStoreDataInterface,
    ConsultantJobAggregateIdInterface
  >;
  private eventStoreHelper: EventStoreHelper;
  constructor(private logger: LoggerContext) {}

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

    await this.eventStoreHelper.startProcess();
    for (const clientId of initiateEvent.data.client_ids) {
      const succeeded = await this.assignClient(clientId);

      if (succeeded) {
        await this.eventStoreHelper.succeedItemProcess(clientId);
      }
    }
    await this.eventStoreHelper.completeProcess();
    this.logger.info('Consultant Assign background process finished', {eventId});
  }

  private async assignClient(clientId: string): Promise<boolean> {
    try {
      await this.eventStoreHelper.assignConsultantToClient(
        this.initiateEvent.data.consultant_role_id,
        this.initiateEvent.data.consultant_id,
        clientId
      );
      this.logger.debug(`Assigned client ${clientId} to consultant ${this.initiateEvent.data.consultant_id}`);
      return true;
    } catch (error) {
      if (error instanceof SequenceIdMismatch) {
        // We can retry again. we fail it for now
        // You might need to reload the aggregate for retry
        this.logger.error('Sequence id mismatch happened. we fail it for now', {
          initiateEvent: this.initiateEvent._id,
          clientId: clientId,
          error
        });
        await this.eventStoreHelper.failItemProcess(
          clientId,
          ConsultantJobAssignErrorItemEnum.SEQUENCE_ID_MISMATCH_ERROR,
          error.message
        );
      } else if (error instanceof ValidationError || error instanceof ResourceNotFoundError) {
        // non-retryable errors
        this.logger.info('assigning consultant to client was not possible due to business validation', error);
        await this.eventStoreHelper.failItemProcess(
          clientId,
          ConsultantJobAssignErrorItemEnum.VALIDATION_ERROR,
          error.message
        );
      } else {
        // for unknown errors we can retry but for now we will mark the mas failure
        this.logger.error('Unknown error occurred during assigning consultant to client');
        await this.eventStoreHelper.failItemProcess(
          clientId,
          ConsultantJobAssignErrorItemEnum.UNKNOWN_ERROR,
          error.message
        );
      }
      return false;
    }
  }
}
