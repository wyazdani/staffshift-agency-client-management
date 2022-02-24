import {LoggerContext} from 'a24-logzio-winston';
import {ConsultantAssignCompletedEventStoreDataInterface} from 'EventStoreDataTypes';
import {EventHandlerInterface} from 'EventHandlerInterface';

export class ConsultantAssignCompletedEventHandler
implements EventHandlerInterface<ConsultantAssignCompletedEventStoreDataInterface> {
  constructor(private logger: LoggerContext) {}
  handle(event: ConsultantAssignCompletedEventStoreDataInterface): Promise<void> {
    return Promise.resolve(undefined);
  }
}
