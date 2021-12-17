import {Db, Timestamp, ChangeStreamOptions} from 'mongodb';
import {STREAM_TYPES_ENUM} from '../../streaming_applications/core/ChangeStreamEnums';
import {
  EventStoreProjectionResumeTokenWriter,
  ResumeTokenWriterOptionsInterface
} from './EventStoreProjectionResumeTokenWriter';

export interface WatchOptionsInterface extends ChangeStreamOptions {
  total?: number; //We use total in seed
  seed_complete?: boolean;
  seed_meta?: {
    event_id: string;
    actioned_at: Date;
  };
}
/**
 * Resume Token Manager class
 *   Used for change stream resume tokens
 *   Used tracks number of writes, can be used for seed skip counter
 */
export class EventStoreProjectionResumeTokenCollectionManager {
  private db: Db;
  private collectionName: string;
  /**
   * Setter for database
   *
   * @param {Object} database - The database connection object
   */
  setDatabase(database: Db): void {
    this.db = database;
  }

  /**
   * Setter for the collection name
   *
   * @param {String} collectionName - The collection name
   */
  setCollectionName(collectionName: string): void {
    this.collectionName = collectionName;
  }

  /**
   * Sets the resume watch/seed options
   * If it's seed, it will continue seeding
   * If it's a watch and there were no watch running in the past, it will resume from start of seed
   * to cover changes during the seed process, more info: https://github.com/A24Group/candidate-meta/issues/94
   *
   * @see https://docs.mongodb.com/manual/changeStreams/#resume-a-change-stream
   *
   * @param {String} pipeline - The pipeline name
   * @param {String} streamType - stream type enum
   * @param {Object} watchOptions - (optional) Watch options
   *
   * @returns {Object} - The modified watched options
   */
  async setResumeAfterWatchOptions(
    pipeline: string,
    streamType: STREAM_TYPES_ENUM,
    watchOptions: WatchOptionsInterface = {}
  ): Promise<WatchOptionsInterface> {
    if (!this.db || !this.collectionName) {
      throw new Error('Set both db and collection name before requesting watch options');
    }
    const pipelineId = `${pipeline}_${streamType}`;
    const resumeAfter = await this.db.collection(this.collectionName).findOne({_id: pipelineId});

    if (streamType === STREAM_TYPES_ENUM.WATCH && !resumeAfter) {
      const seedPipelineId = `${pipeline}_seed`;
      const seed = await this.db.collection(this.collectionName).findOne({_id: seedPipelineId});

      if (seed && seed.created_at) {
        watchOptions.startAtOperationTime = new Timestamp(1, seed.created_at.valueOf() / 1000);
      }
    }
    if (resumeAfter) {
      watchOptions.resumeAfter = resumeAfter.token;
      watchOptions.total = resumeAfter.total;

      if (resumeAfter.seed_complete !== undefined) {
        watchOptions.seed_complete = resumeAfter.seed_complete;
      }
      if (resumeAfter.seed_meta) {
        watchOptions.seed_meta = resumeAfter.seed_meta;
      }
    }

    return watchOptions;
  }

  /**
   * Gets a configured resume token writer instance
   *
   * @param {String} pipeline - The pipeline name
   * @param {String} streamType = Stream type e.g watch or enrich
   * @param {Object} writerOptions - The writer options
   */
  getResumeTokenWriterStream(pipelineId: string, writerOptions = {}): EventStoreProjectionResumeTokenWriter {
    const tokenOpts: ResumeTokenWriterOptionsInterface = {
      ...writerOptions,
      _id: pipelineId,
      collection: this.db.collection(this.collectionName)
    };

    return new EventStoreProjectionResumeTokenWriter(tokenOpts);
  }

  /**
   * Will set the seed properties that indicate process has completed
   * When the seed is actually empty no seed entry exists, create the details when marking complete
   *
   * @param {String} pipelineId
   */
  async setEventStorePipelineSeedComplete(pipelineId: string): Promise<void> {
    await this.db.collection(this.collectionName).updateOne(
      {_id: pipelineId},
      {
        $set: {seed_complete: true},
        $currentDate: {
          seed_completed_at: {$type: 'date'}
        },
        $setOnInsert: {
          seed_meta: {
            actioned_at: new Date(),
            source_empty: true
          },
          created_at: new Date()
        }
      },
      {upsert: true}
    );
  }
}
