import {LoggerContext} from 'a24-logzio-winston';
import {BulkProcessManagerV1} from '../models/BulkProcessManagerV1';

/**
 * Responsible for managing heart beat field of bulk process manager
 * we start the interval when start processing and when we are done we stop processing
 */
export class HeartbeatService {
  static createInstance(logger: LoggerContext, processId: string, interval: number) {
    return new HeartbeatService(logger, processId, interval);
  }
  private handler: NodeJS.Timer;
  constructor(private logger: LoggerContext, private processId: string, private interval: number) {}
  start(): void {
    this.handler = setInterval(async () => {
      try {
        this.logger.info('Updating heartbeat for process', {processId: this.processId});
        await BulkProcessManagerV1.updateOne(
          {_id: this.processId},
          {
            $set: {
              heart_beat: new Date()
            }
          }
        );
      } catch (error) {
        this.logger.error('Error updating heartbeat', error);
        // We don't throw error here as it will kill the pod
        // The right way of doing this is to trigger shutdown on whole process manager
        // Which is possible and we can do that in the future.
      }
    }, this.interval);
  }
  stop(): void {
    if (this.handler) {
      clearInterval(this.handler);
    }
  }
}
