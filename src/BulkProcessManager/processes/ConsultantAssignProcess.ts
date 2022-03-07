import {LoggerContext} from 'a24-logzio-winston';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {ProcessInterface} from '../ProcessInterface';

export class ConsultantAssignProcess implements ProcessInterface {
  constructor(private logger: LoggerContext) {}

  execute(initiateEvent: EventStorePubSubModelInterface): Promise<void> {
    return Promise.resolve();
  }
}
