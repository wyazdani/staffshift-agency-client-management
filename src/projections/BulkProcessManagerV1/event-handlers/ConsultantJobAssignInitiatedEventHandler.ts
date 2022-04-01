import {LoggerContext} from 'a24-logzio-winston';
import {EventHandlerInterface} from 'EventHandlerInterface';
import {ConsultantJobAssignInitiatedEventStoreDataInterface} from 'EventTypes';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {BulkProcessManagerV1, BulkProcessManagerStatusEnum} from '../../../models/BulkProcessManagerV1';
import {MONGO_ERROR_CODES} from 'staffshift-node-enums';

export class ConsultantJobAssignInitiatedEventHandler
implements EventHandlerInterface<EventStorePubSubModelInterface<ConsultantJobAssignInitiatedEventStoreDataInterface>> {
  constructor(private logger: LoggerContext) {}

  async handle(
    event: EventStorePubSubModelInterface<ConsultantJobAssignInitiatedEventStoreDataInterface>
  ): Promise<void> {
    try {
      await BulkProcessManagerV1.create({
        _id: event.data._id,
        aggregate_id: event.aggregate_id,
        status: BulkProcessManagerStatusEnum.NEW,
        initiate_event_id: event._id
      });
    } catch (error) {
      if (error.code === MONGO_ERROR_CODES.DUPLICATE_KEY) {
        this.logger.debug('Duplicate consultant job initiated event', {_id: event._id});
        return;
      }
      throw error;
    }
  }
}
