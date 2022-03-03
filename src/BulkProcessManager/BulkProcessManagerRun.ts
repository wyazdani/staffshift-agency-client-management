import {LoggerContext} from 'a24-logzio-winston';
import {Error} from 'mongoose';
import {setTimeout} from 'timers/promises';
import {
  BulkProcessManagerV1,
  BulkProcessManagerStatusEnum,
  BulkProcessManagerV1DocumentType
} from '../models/BulkProcessManagerV1';

interface BulkProcessManagerOptsInterface {
  parallelLimit: number;
  delay: number;
}
export class BulkProcessManagerRun {
  private shutdown = false;
  constructor(private logger: LoggerContext, private opts: BulkProcessManagerOptsInterface) {}
  async start(): Promise<void> {
    this.logger.info('Starting bulk process manager');
    while (!this.shutdown) {
      const bulkRecords = await BulkProcessManagerV1.find({
        status: BulkProcessManagerStatusEnum.NEW
      })
        .limit(this.opts.parallelLimit)
        .exec();

      for (const record of bulkRecords) {
        if (await this.updateToProcessing(record)) {
          // TODO
        }
      }
      await setTimeout(this.opts.delay);
    }
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
      if (error instanceof Error.VersionError) {
        this.logger.notice('Other process already picked the job', {_id: record._id, error});
        return false;
      } else {
        this.logger.error('Unknown error in changing status to processing', {_id: record._id, error});
        throw error;
      }
    }
  }

  private async findInitiateEvent(eventId: string) {

  }
}
