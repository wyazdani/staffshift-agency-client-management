import {Timestamp} from 'mongodb';
import {PIPELINE_TYPES_ENUM, STREAM_TYPES_ENUM} from '../../streaming_applications/core/ChangeStreamEnums';
import {AGENCY_CLIENT_MANAGEMENT_DB_KEY} from '../../streaming_applications/DatabaseConfigKeys';
import {MongoClients} from '../../streaming_applications/core/MongoClients';
import {LoggerContext} from 'a24-logzio-winston';
import {EventStore} from '../../models/EventStore';
import {
  EventStoreProjectionResumeTokenCollectionManager,
  WatchOptionsInterface
} from './EventStoreProjectionResumeTokenCollectionManager';
import {EventStoreProjectionTransformer} from './transformers/EventStoreProjectionTransformer';
import {EventStorePubSubTransformer} from './transformers/EventStorePubSubTransformer';
import {StreamEventHandlers} from '../../streaming_applications/core/StreamEventHandlers';
import {EventStoreProjectionSeedTransformer} from './transformers/EventStoreProjectionSeedTransformer';

const HIGH_WATER_MARK = 5;

export class EventStorePipeline {
  private readonly logger: LoggerContext;
  private readonly clientManager: MongoClients;
  private readonly tokenManager: EventStoreProjectionResumeTokenCollectionManager;
  private readonly watchId: string;

  constructor(
    logger: LoggerContext,
    clientManager: MongoClients,
    tokenManager: EventStoreProjectionResumeTokenCollectionManager
  ) {
    this.logger = logger;
    this.clientManager = clientManager;
    this.tokenManager = tokenManager;
    this.watchId = EventStorePipeline.getID() + '_watch';
  }

  static getID(): string {
    return 'event_store_projection';
  }

  /**
   * Return an array of DB identifiers that the pipeline interacts with
   *
   * @returns {Array<String>}
   */
  getMongoClientConfigKeys(): string[] {
    return [AGENCY_CLIENT_MANAGEMENT_DB_KEY];
  }

  /**
   * Return pipeline type
   *
   * @returns {String}
   */
  getType(): PIPELINE_TYPES_ENUM {
    return PIPELINE_TYPES_ENUM.CORE;
  }

  /**
   * Initiates and process change stream events
   */
  async start(): Promise<void> {
    const watchOptions = await this.tokenManager.setResumeAfterWatchOptions(
      EventStorePipeline.getID(),
      STREAM_TYPES_ENUM.WATCH
    );

    if (!watchOptions.seed_complete) {
      return await this.seed(watchOptions);
    }
    if (!watchOptions.resumeAfter) {
      if (!watchOptions.seed_meta || !watchOptions.seed_meta.actioned_at) {
        this.logger.error('Seed has completed, no token set need the last event timestamp to start watching', {
          watchOptions,
          pipeline_id: EventStorePipeline.getID()
        });
        return process.exit(1);
      }
      watchOptions.startAtOperationTime = new Timestamp(1, watchOptions.seed_meta.actioned_at.valueOf() / 1000);
    }
    return await this.watch(watchOptions);
  }

  private async watch(watchOptions: WatchOptionsInterface): Promise<void> {
    const watchDb = await this.clientManager.getClientDatabase(this.logger, AGENCY_CLIENT_MANAGEMENT_DB_KEY);
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const watchStream: any = watchDb.collection(EventStore.collection.name).watch(watchOptions);

    this.logger.info('Collection watch initiated', {
      collection: EventStore.collection.name,
      pipeline_id: EventStorePipeline.getID(),
      stream_type: STREAM_TYPES_ENUM.WATCH
    });

    const eventStoreTransformer = new EventStoreProjectionTransformer({highWaterMark: HIGH_WATER_MARK});
    //set options to initialize streams
    const opts = {
      highWaterMark: HIGH_WATER_MARK,
      pipeline: EventStorePipeline.getID(),
      logger: this.logger
    };
    const projectionTransformer = new EventStorePubSubTransformer(opts);
    const tokenWriterStream = this.tokenManager.getResumeTokenWriterStream(this.watchId, {
      highWaterMark: HIGH_WATER_MARK,
      persistRate: 1
    });

    StreamEventHandlers.attachEventHandlers(this.logger, watchStream);

    watchStream
      .pipe(StreamEventHandlers.attachEventHandlers(this.logger, eventStoreTransformer))
      .pipe(StreamEventHandlers.attachEventHandlers(this.logger, projectionTransformer))
      .pipe(StreamEventHandlers.attachEventHandlers(this.logger, tokenWriterStream));
  }

  private async seed(watchOptions: WatchOptionsInterface): Promise<void> {
    const db = await MongoClients.getInstance().getClientDatabase(this.logger, AGENCY_CLIENT_MANAGEMENT_DB_KEY);
    const cursor = db
      .collection(EventStore.collection.name)
      .find({})
      .sort({created_at: 1, _id: 1})
      .skip(watchOptions.total || 0);
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const stream: any = cursor;

    // If there are no next results, mark seed complete nothing to pipe
    if (!(await cursor.hasNext())) {
      await this.tokenManager.setEventStorePipelineSeedComplete(this.watchId);
      return await this.start();
    }

    const readTransformer = new EventStoreProjectionSeedTransformer({highWaterMark: HIGH_WATER_MARK});
    //set options to initialize streams
    const tokenWriterStream = this.tokenManager.getResumeTokenWriterStream(this.watchId, {
      highWaterMark: HIGH_WATER_MARK,
      persistRate: 1
    });
    const pubsubTransformer = new EventStorePubSubTransformer({
      highWaterMark: HIGH_WATER_MARK,
      pipeline: EventStorePipeline.getID(),
      logger: this.logger
    });

    StreamEventHandlers.attachEventHandlers(this.logger, stream);
    stream
      .pipe(StreamEventHandlers.attachEventHandlers(this.logger, readTransformer))
      .pipe(StreamEventHandlers.attachEventHandlers(this.logger, pubsubTransformer))
      .pipe(StreamEventHandlers.attachEventHandlers(this.logger, tokenWriterStream));

    tokenWriterStream.on('finish', async () => {
      await this.tokenManager.setEventStorePipelineSeedComplete(this.watchId);
      return this.start();
    });
  }
}
