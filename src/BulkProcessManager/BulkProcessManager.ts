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
import {ProcessHeartbeat} from './ProcessHeartbeat';

interface BulkProcessManagerOptsInterface {
  parallel_limit: number;
  polling_interval: number;
  heartbeat_interval: number;
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
   *  1. find processManager records with status new
   *  2. change status to `processing`
   *  3. map `initiate event` to related `process` using `ProcessFactory`
   *  4. call process function
   */
  async start(): Promise<void> {
    this.logger.info('Starting bulk process manager');
    while (!this.shutdownInitiated) {
      this.processing = true;
      this.logger.debug('Checking BulkProcessManager collection');
      const bulkRecords = await BulkProcessManagerV1.find({
        $or: [{
          status: BulkProcessManagerStatusEnum.NEW
        }, {
          status: BulkProcessManagerStatusEnum.PROCESSING,
          heart_beat: {
            $lte // @TODO: implement condition here
          }
        }]
      })
        .sort({created_at: 1})
        .limit(this.opts.parallel_limit)
        .exec();

      if (bulkRecords.length > 0) {
        this.logger.info(`Starting to process ${bulkRecords.length} processes`);
        await each(bulkRecords, async (record) => {
          const heartbeat = new ProcessHeartbeat(this.logger, record._id, this.opts.heartbeat_interval);

          heartbeat.start();
          try {
            if (await this.updateToProcessing(record)) {
              const event = await this.findInitiateEvent(record.initiate_event_id);

              await this.findAndCallProcess(event);
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
   */
  private async updateToProcessing(record: BulkProcessManagerV1DocumentType): Promise<boolean> {
    record.status = BulkProcessManagerStatusEnum.PROCESSING;
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
  }
}
