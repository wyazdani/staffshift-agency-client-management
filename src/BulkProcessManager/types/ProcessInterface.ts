import {EventStorePubSubModelInterface} from 'ss-eventstore';

export interface ProcessInterface {
  /**
   * Execute function should be resumable. what does that mean?
   * - it means the process might be crashed while processing. we will call `execute` again
   * - you should left fold events for the aggregate and see what is the current status of the job
   */
  execute(initiateEvent: EventStorePubSubModelInterface): Promise<void>;

  /**
   * When process is finished, we call this function.
   * in complete function process will right the `completed` event for parent aggregate
   */
  complete(): Promise<void>;
}
