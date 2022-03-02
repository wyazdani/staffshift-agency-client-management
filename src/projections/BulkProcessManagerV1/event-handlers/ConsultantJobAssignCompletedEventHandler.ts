import {LoggerContext} from 'a24-logzio-winston';
import {ConsultantJobAssignCompletedEventStoreDataInterface} from 'EventStoreDataTypes';
import {EventHandlerInterface} from 'EventHandlerInterface';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {BulkProcessManagerV1, BulkProcessManagerStatusEnum} from '../../../models/BulkProcessManagerV1';

export class ConsultantJobAssignCompletedEventHandler
implements EventHandlerInterface<EventStorePubSubModelInterface<ConsultantJobAssignCompletedEventStoreDataInterface>> {
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
