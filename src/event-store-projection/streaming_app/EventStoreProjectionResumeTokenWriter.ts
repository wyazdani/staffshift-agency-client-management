import {Writable, WritableOptions} from 'stream';
import {Collection, ObjectID} from 'mongodb';

interface ChangeEventDataInterface {
  _id: ObjectID;
  operationType: string;
  event_meta?: {
    event_id: ObjectID;
    actioned_at: Date;
  };
  seed_meta?: {
    event_id: ObjectID;
    actioned_at: Date;
  };
}

interface TrackerDataInterface {
  token?: ObjectID;
  event_meta?: {
    event_id: ObjectID;
    actioned_at: Date;
  };
  seed_meta?: {
    event_id: ObjectID;
    actioned_at: Date;
  };
}

export interface ResumeTokenWriterOptionsInterface extends WritableOptions {
  _id: string;
  collection: Collection;
  persistRate?: number;
}
/**
 * Upserts a resume token to the specified collection.
 * Using the persist rate you can reduce the number of token writes for fast moving data
 *  This would mean a resume might replay a couple of events, use with caution
 */
export class EventStoreProjectionResumeTokenWriter extends Writable {
  private counter: number;
  private isFirstTime: boolean;
  private readonly _id: string;
  private readonly collection: Collection;
  private readonly persistRate: number;
  /**
   *
   * @param {String} opts._id - Identifier to be used for the updateOne
   * @param {Object} opts.collection - The collection object that will be used for the updateOne
   * @param {Number} opts.persistRate - Will persist the token every X events
   */
  constructor(opts: ResumeTokenWriterOptionsInterface) {
    // We only cater for object mode
    opts.objectMode = true;
    super(opts);
    this.counter = 0;
    this.isFirstTime = true;
    this._id = opts._id;
    this.collection = opts.collection;
    this.persistRate = opts.persistRate || 1;
  }

  _write(data: ChangeEventDataInterface, encoding: BufferEncoding, next: (error?: Error | null) => void): void {
    this.counter++;
    const trackerData: TrackerDataInterface = {};

    if (data.operationType == 'EVENT') {
      trackerData.token = data._id;
      trackerData.event_meta = data.event_meta;
    }
    if (data.operationType == 'SEED') {
      trackerData.seed_meta = data.seed_meta;
    }
    if (this.counter >= this.persistRate || this.isFirstTime) {
      this.isFirstTime = false;
      this.collection.updateOne(
        {_id: this._id},
        {
          $set: trackerData,
          $inc: {total: this.counter},
          $currentDate: {updated_at: true},
          $setOnInsert: {
            created_at: new Date()
          }
        },
        {upsert: true},
        (err) => {
          this.counter = 0;
          next(err);
        }
      );
      return;
    }
    next();
  }
}
