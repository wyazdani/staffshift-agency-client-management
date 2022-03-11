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
import {AggregateHelper} from './AggregateHelper';

/**
 * It handles bulk consultant assign to client
 */
export class ConsultantAssignProcess implements ProcessInterface {
  constructor(private logger: LoggerContext) {}

  async execute(
    initiateEvent: EventStorePubSubModelInterface<
      ConsultantJobAssignInitiatedEventStoreDataInterface,
      ConsultantJobAggregateIdInterface
    >
  ): Promise<void> {
    this.logger.info('Consultant Assign background process started', initiateEvent);
    const eventRepository = new EventRepository(
      EventStore,
      initiateEvent.correlation_id,
      initiateEvent.meta_data,
      initiateEvent._id
    );
    const aggregateHelper = new AggregateHelper(
      initiateEvent.aggregate_id.agency_id,
      initiateEvent.data._id,
      eventRepository
    );

    await aggregateHelper.startProcess();
    for (const clientId of initiateEvent.data.client_ids) {
      try {
        await aggregateHelper.assignConsultantToClient(
          initiateEvent.data.consultant_role_id,
          initiateEvent.data.consultant_id,
          clientId
        );
      } catch (error) {
        if (error instanceof SequenceIdMismatch) {
          // We can retry again. we fail it for now
          // You might need to reload the aggregate for retry
          this.logger.error('Sequence id mismatch happened. we fail it for now', {
            initiateEvent: initiateEvent._id,
            clientId: clientId,
            error
          });
          await aggregateHelper.failItemProcess(
            clientId,
            ConsultantJobAssignErrorItemEnum.INTERNAL_ERROR,
            error.message
          );
        } else if (error instanceof ValidationError || error instanceof ResourceNotFoundError) {
          // none retryable errors
          this.logger.info('assigning consultant to client was not possible due to business validation', error);
          await aggregateHelper.failItemProcess(
            clientId,
            ConsultantJobAssignErrorItemEnum.VALIDATION_ERROR,
            error.message
          );
        } else {
          // for unknown errors we can retry but for now we will mark the mas failure
          this.logger.error('Unknown error occurred during assigning consultant to client');
          await aggregateHelper.failItemProcess(
            clientId,
            ConsultantJobAssignErrorItemEnum.INTERNAL_ERROR,
            error.message
          );
        }
      }
      await aggregateHelper.progressProcess([clientId]);
    }
    await aggregateHelper.completeProcess();
  }
}
