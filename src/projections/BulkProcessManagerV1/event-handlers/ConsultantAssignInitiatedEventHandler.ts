import {LoggerContext} from 'a24-logzio-winston';
import {ConsultantAssignInitiatedEventStoreDataInterface} from 'EventStoreDataTypes';
import {EventHandlerInterface} from 'EventHandlerInterface';

export class ConsultantAssignInitiatedEventHandler
implements EventHandlerInterface<ConsultantAssignInitiatedEventStoreDataInterface> {
  constructor(private logger: LoggerContext) {}

  handle(event: ConsultantAssignInitiatedEventStoreDataInterface): Promise<void> {
    return Promise.resolve(undefined);
  }
}
