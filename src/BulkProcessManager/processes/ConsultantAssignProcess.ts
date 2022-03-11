import {LoggerContext} from 'a24-logzio-winston';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {ProcessInterface} from '../types/ProcessInterface';

export class ConsultantAssignProcess implements ProcessInterface {
  constructor(private logger: LoggerContext) {}

  execute(initiateEvent: EventStorePubSubModelInterface): Promise<void> {
    this.logger.info('Consultant Assign background process started', initiateEvent);
    return Promise.resolve();
  }
}
