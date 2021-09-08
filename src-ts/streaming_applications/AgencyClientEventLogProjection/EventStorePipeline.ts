import {Pipeline, WatchHandler} from "../core/Pipeline";
import {PIPELINE_TYPES, STREAM_TYPES} from "../core/ChangeStreamEnums";
import {MongoClients} from "../core/MongoClients";
import {LoggerContext} from "a24-logzio-winston";
import {ResumeTokenCollectionManager} from "../core/ResumeTokenCollectionManager";
import {AGENCY_CLIENT_MANAGEMENT_DB_KEY} from "../DatabaseConfigKeys";
import {StreamEventHandlers} from "../core/StreamEventHandlers";
import {AgencyClientEventLogProjection} from "./transformers/AgencyClientEventLogProjection";
import {AgencyClientEventLog} from "../../models/AgencyClientEventLog";
import {EventStore} from "../../models/EventStore";
import {EventStoreTransformer} from "../core/streams/EventStoreTransformer";

const HIGH_WATER_MARK = 5;
/**
 * Responsible for aggregating agency candidate details
 */
export class EventStorePipeline implements Pipeline{
  getID(): string {
    return 'agency_client_event_log_event_store';
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
  getType(): PIPELINE_TYPES {
    return PIPELINE_TYPES.CORE;
  }
  /**
   * Initiates and process change stream events
   *
   * @param {LoggerContext} logger - Logger instance
   * @param {MongoClients} clientManager - Client manager for mongodb connections
   * @param {ResumeTokenCollectionManager} tokenManager - Instance of ResumeTokenCollectionManager class
   */
  async watch(logger: LoggerContext, clientManager: MongoClients, tokenManager: ResumeTokenCollectionManager): Promise<WatchHandler> {
    const watchOptions = await tokenManager.setResumeAfterWatchOptions(this.getID(), STREAM_TYPES.WATCH);
    const watchDb = await clientManager.getClientDatabase(logger, AGENCY_CLIENT_MANAGEMENT_DB_KEY);
    const watchStream: any = watchDb.collection(EventStore.collection.name).watch(watchOptions);
    logger.info('Collection watch initiated', {collection: EventStore.collection.name, pipeline_id: this.getID(), stream_type: STREAM_TYPES.WATCH});

    const eventStoreTransformer = new EventStoreTransformer({highWaterMark: HIGH_WATER_MARK});
    //set options to initialize streams
    const opts = {
      highWaterMark: HIGH_WATER_MARK,
      eventstore: EventStore,
      model: AgencyClientEventLog,
      pipeline: this.getID(),
      logger: logger
    };
    const projectionTransformer = new AgencyClientEventLogProjection(opts);
    const tokenWriterStream = tokenManager.getResumeTokenWriterStream(this.getID(), STREAM_TYPES.WATCH, {highWaterMark: HIGH_WATER_MARK});
    StreamEventHandlers.attachEventHandlers(logger, watchStream);

    watchStream
      .pipe(StreamEventHandlers.attachEventHandlers(logger, eventStoreTransformer))
      .pipe(StreamEventHandlers.attachEventHandlers(logger, projectionTransformer))
      .pipe(StreamEventHandlers.attachEventHandlers(logger, tokenWriterStream));

    const className = this.constructor.name;
    return new class implements WatchHandler {
      /**
       * Shutdown the pipeline
       * Mongodb ChangeStream does not propagate close event through the pipeline, we need to call .end() manually
       * on first stage after changestream and then catch finish event on the last stage.
       *
       * @returns {Promise<void>}
       */
      shutdown() {
        logger.info(`pipeline ${className} starting shutdown`);
        return new Promise<void>((resolve) => {
          tokenWriterStream.on('finish', () => {
            logger.info(`pipeline ${className} finished shutdown`);
            resolve();
          });
          watchStream.close(() => eventStoreTransformer.end());
        });
      }
    }
  }
}