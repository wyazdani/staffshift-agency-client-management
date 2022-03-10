import {EventStorePubSubModelInterface} from 'ss-eventstore';

export interface ProcessInterface {
  execute(initiateEvent: EventStorePubSubModelInterface): Promise<void>;
}
