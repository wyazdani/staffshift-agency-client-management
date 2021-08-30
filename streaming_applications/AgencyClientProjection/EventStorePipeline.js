'use strict';
const {CORE} = require('../core/enums/PipelineTypes');
const {AGENCY_CLIENT_MANAGEMENT_DB_KEY} = require('../DatabaseConfigKeys');
const StreamEventHandlers = require('../core/StreamEventHandlers');
const EventStoreTransformer = require('../core/streams/EventStoreTransformer');
const AgencyClientProjection = require('./transformers/AgencyClientProjection');
const {WATCH} = require('../core/enums/StreamTypes');

const {AgencyClients, EventStore} = require('../../models');
const HIGH_WATER_MARK = 5;

/**
 * Responsible for aggregating agency candidate details
 */
class EventStorePipeline {

  static getID() {
    return 'agency_client_event_store';
  }

  /**
   * Return pipeline type
   *
   * @returns {String}
   */
  static getType() {
    return CORE;
  }

  /**
   * Return an array of DB identifiers that the pipeline interacts with
   *
   * @returns {Array<String>}
   */
  static getMongoClientConfigKeys() {
    return [AGENCY_CLIENT_MANAGEMENT_DB_KEY];
  }

  /**
   * Initiates and process change stream events
   *
   * @param {Object} logger - Logger instance
   * @param {MongoClients} clientManager - Client manager for mongodb connections
   * @param {ResumeTokenCollectionManager} tokenManager - Instance of ResumeTokenCollectionManager class
   */
  static async watch(logger, clientManager, tokenManager) {
    const watchOptions = await tokenManager.setResumeAfterWatchOptions(EventStorePipeline.getID(), WATCH);
    const watchDb = await clientManager.getClientDatabase(logger, AGENCY_CLIENT_MANAGEMENT_DB_KEY);
    const watchStream = watchDb.collection(EventStore.collection.name).watch(watchOptions);
    logger.info('Collection watch initiated', {collection: EventStore.collection.name, pipeline_id: EventStorePipeline.getID(), stream_type: WATCH});

    const eventStoreTransformer = new EventStoreTransformer({highWaterMark: HIGH_WATER_MARK});
    //set options to initialize streams
    const opts = {
      highWaterMark: HIGH_WATER_MARK,
      eventstore: EventStore,
      model: AgencyClients,
      pipeline: EventStorePipeline.getID(),
      logger: logger
    };
    const projectionTransformer = new AgencyClientProjection(opts);
    const tokenWriterStream = tokenManager.getResumeTokenWriterStream(EventStorePipeline.getID(), WATCH, {highWaterMark: HIGH_WATER_MARK});
    StreamEventHandlers.attachEventHandlers(logger, watchStream);

    watchStream
      .pipe(StreamEventHandlers.attachEventHandlers(logger, eventStoreTransformer))
      .pipe(StreamEventHandlers.attachEventHandlers(logger, projectionTransformer))
      .pipe(StreamEventHandlers.attachEventHandlers(logger, tokenWriterStream));

    return {
      /**
       * Shutdown the pipeline
       * Mongodb ChangeStream does not propagate close event through the pipeline, we need to call .end() manually
       * on first stage after changestream and then catch finish event on the last stage.
       *
       * @returns {Promise<unknown>}
       */
      shutdown: () => {
        logger.info(`pipeline ${this.name} starting shutdown`);
        return new Promise((resolve) => {
          tokenWriterStream.on('finish', () => {
            logger.info(`pipeline ${this.name} finished shutdown`);
            resolve();
          });
          watchStream.close(() => eventStoreTransformer.end());
        });
      }
    };
  }
}

module.exports = EventStorePipeline;