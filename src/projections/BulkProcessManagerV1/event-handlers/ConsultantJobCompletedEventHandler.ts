import {LoggerContext} from 'a24-logzio-winston';
import {ConsultantJobAssignCompletedEventStoreDataInterface} from 'EventTypes';
import {EventHandlerInterface} from 'EventHandlerInterface';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {BulkProcessManagerV1, BulkProcessManagerStatusEnum} from '../../../models/BulkProcessManagerV1';

export class ConsultantJobCompletedEventHandler
implements
    EventHandlerInterface<
      EventStorePubSubModelInterface<Pick<ConsultantJobAssignCompletedEventStoreDataInterface, '_id'>>
    > {
  constructor(private logger: LoggerContext) {}
  async handle(
    event: EventStorePubSubModelInterface<Pick<ConsultantJobAssignCompletedEventStoreDataInterface, '_id'>>
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
