import {Db, Timestamp, ChangeStreamOptions} from 'mongodb';
import {STREAM_TYPES_ENUM} from './ChangeStreamEnums';
import {ResumeTokenWriter, ResumeTokenWriterOptionsInterface} from './streams/ResumeTokenWriter';

export interface WatchOptionsInterface extends ChangeStreamOptions {
  total?: number; //We use total in seed
}
/**
 * Resume Token Manager class
 *   Used for change stream resume tokens
 *   Used tracks number of writes, can be used for seed skip counter
 */
export class ResumeTokenCollectionManager {
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
    }

    return watchOptions;
  }

  /**
   * Gets a configured resume token writer instance
   *
   * @param {String} pipeline - The pipeline name
   * @param {String} streamType = Stream type e.g watch or enrich
   * @param {Object} writerOptions - The writer options
   *
   * @returns {ResumeTokenWriter} - The resume token instance
   */
  getResumeTokenWriterStream(pipeline: string, streamType: STREAM_TYPES_ENUM, writerOptions = {}): ResumeTokenWriter {
    const pipelineId = `${pipeline}_${streamType}`;
    const tokenOpts: ResumeTokenWriterOptionsInterface = {
      ...writerOptions,
      _id: pipelineId,
      collection: this.db.collection(this.collectionName)
    };

    return new ResumeTokenWriter(tokenOpts);
  }
}
