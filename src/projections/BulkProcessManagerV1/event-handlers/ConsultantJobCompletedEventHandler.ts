import {LoggerContext} from 'a24-logzio-winston';
import {ConsultantJobAssignCompletedEventStoreDataInterface} from 'EventTypes';
import {EventHandlerInterface} from 'EventHandlerInterface';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {BulkProcessManagerV1, BulkProcessManagerStatusEnum} from '../../../models/BulkProcessManagerV1';

/**
 * Why using an internal interface?
 *  because we're using the command handler for different events
 */
interface ConsultantJobCompletedEventStoreDataInterface {
  _id: string;
}

export class ConsultantJobCompletedEventHandler
implements EventHandlerInterface<EventStorePubSubModelInterface<ConsultantJobCompletedEventStoreDataInterface>> {
  constructor(private logger: LoggerContext) {}
  async handle(
    event: EventStorePubSubModelInterface<ConsultantJobAssignCompletedEventStoreDataInterface>
  ): Promise<void> {
    await BulkProcessManagerV1.updateOne(
      {
        _id: event.data._id
      },
      {
        $set: {
          status: BulkProcessManagerStatusEnum.COMPLETED
        }
      }
    );
  }
}
