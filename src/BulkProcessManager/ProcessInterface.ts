import {EventStorePubSubModelInterface} from 'ss-eventstore';

export abstract class ProcessInterface {
  abstract execute(initiateEvent: EventStorePubSubModelInterface): Promise<void>;
}