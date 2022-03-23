import {LoggerContext} from 'a24-logzio-winston';
import {each} from 'async';
import {EventEmitter} from 'events';
import {EventStoreHttpClient, EventStorePubSubModelInterface} from 'ss-eventstore';
import {setTimeout} from 'timers/promises';
import {
  BulkProcessManagerV1,
  BulkProcessManagerStatusEnum,
  BulkProcessManagerV1DocumentType
} from '../models/BulkProcessManagerV1';
import {ProcessFactory} from './ProcessFactory';
import {HeartbeatService} from './HeartbeatService';

interface BulkProcessManagerOptsInterface {
  parallel_limit: number;
  polling_interval: number;
  heartbeat_interval: number;
  heartbeat_expire_limit: number;
  eventStoreHttpClient: EventStoreHttpClient;
}
export class BulkProcessManager {
  private shutdownInitiated = false;
  private processing = false;
  private shutdownEmitter = new EventEmitter();
  constructor(private logger: LoggerContext, private opts: BulkProcessManagerOptsInterface) {}

  /**
   * Starts bulk process manager
   * Steps:
   * loop:
   *  1. find processManager records with
   *    a. status new
   *   or
   *    b. status processing and  heart beat not updated for a while
   *          (This way we can detect crashed processes and make them survive)
   *  2. change status to `processing`
   *  3. map `initiate event` to related `process` using `ProcessFactory`
   *  4. call process function
   *
   */
  async start(): Promise<void> {
    this.logger.info('Starting bulk process manager');
    while (!this.shutdownInitiated) {
      this.processing = true;
      this.logger.debug('Checking BulkProcessManager collection');
      const bulkRecords = await BulkProcessManagerV1.find({
        $or: [
          {
            status: BulkProcessManagerStatusEnum.NEW
          },
          {
            status: BulkProcessManagerStatusEnum.PROCESSING,
            heart_beat: {
              $lte: new Date(new Date().valueOf() - this.opts.heartbeat_expire_limit)
            }
          }
        ]
      })
        .sort({created_at: 1})
        .limit(this.opts.parallel_limit)
        .exec();

      if (bulkRecords.length > 0) {
        this.logger.info(`Starting to process ${bulkRecords.length} processes`);
        await each(bulkRecords, async (record) => {
          const heartbeat = HeartbeatService.createInstance(this.logger, record._id, this.opts.heartbeat_interval);

          try {
            if (await this.updateToProcessing(record)) {
              heartbeat.start();
              const event = await this.findInitiateEvent(record.initiate_event_id);

              await this.findAndCallProcess(event);
              await this.updateToCompleted(record._id);
            }
          } catch (error) {
            this.logger.error('Error in bulk process manager process function', {processId: record._id, error});
            // We don't throw error here to not break the promise, after we stop the heartbeat we will find
            // the process record again and retry processing
          }
          heartbeat.stop();
        });
        this.logger.info(`Processing ${bulkRecords.length} processes finished`);
      }

      this.processing = false;
      this.shutdownEmitter.emit('finished');
      await setTimeout(this.opts.polling_interval);
    }
  }

  /**
   * issues shutdown on process manager
   * It resolves the returned promise when there is not running process in background
   * @TODO: we might need to call shutdown on each running process and gracefully shutdown them
   * but for now we continue without doing that
   */
  shutdown(): Promise<void> {
    this.shutdownInitiated = true;
    if (!this.processing) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      this.shutdownEmitter.once('finished', () => {
        resolve();
      });
    });
  }

  /**
   * changes the status of record, returns true if it updated the record
   *
   * Forcing changing heart beat field here:
   *  - It's for dead processes. dead processes already have status of `processing`
   *  - We wanted to prevent other processes in parallel to pick the same dead process.
   *  - When we update heart beat to current date other processes won't pick same dead process again.
   *  - We increment the counter to make sure we have locking in place.
   */
  private async updateToProcessing(record: BulkProcessManagerV1DocumentType): Promise<boolean> {
    record.status = BulkProcessManagerStatusEnum.PROCESSING;
    record.heart_beat = new Date();
    record.increment();
    try {
      await record.save();
      return true;
    } catch (error) {
      if (error.name === 'VersionError') {
        this.logger.notice('Other process already picked the job', {_id: record._id, error});
        return false;
      }
      this.logger.error('Unknown error in changing status to processing', {_id: record._id, error});
      throw error;
    }
  }

  private async updateToCompleted(processId: string): Promise<void> {
    await BulkProcessManagerV1.updateOne(
      {_id: processId},
      {
        $set: {
          status: BulkProcessManagerStatusEnum.COMPLETED
        }
      }
    );
  }

  private async findInitiateEvent(eventId: string): Promise<EventStorePubSubModelInterface> {
    const event = await this.opts.eventStoreHttpClient.getEvent(eventId);

    if (!event) {
      throw new Error(`Could not find event ${eventId}`);
    }
    return event;
  }

  private async findAndCallProcess(initiateEvent: EventStorePubSubModelInterface) {
    const process = ProcessFactory.getProcess(this.logger, initiateEvent.type);

    await process.execute(initiateEvent);
    await process.complete();
  }
}
