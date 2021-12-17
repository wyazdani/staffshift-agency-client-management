import Logger from 'a24-logzio-winston';
import config from 'config';
import {MongoConfigurationInterface} from 'MongoConfigurationInterface';
import mongoose from 'mongoose';
import {PIPELINE_TYPES_ENUM} from '../../streaming_applications/core/ChangeStreamEnums';
import {MongoClients} from '../../streaming_applications/core/MongoClients';
import {AGENCY_CLIENT_MANAGEMENT_DB_KEY} from '../../streaming_applications/DatabaseConfigKeys';
import {EventStoreProjectionResumeTokenCollectionManager} from './EventStoreProjectionResumeTokenCollectionManager';
import {EventStoreWatcherContext} from './EventStoreWatcherContext';
import {MessagePublisher} from 'a24-node-pubsub';
const StreamTracker = 'StreamTracker';

mongoose.Promise = global.Promise;

mongoose.connect(
  config.get<MongoConfigurationInterface>('mongo').database_host,
  config.get<MongoConfigurationInterface>('mongo').options
);

mongoose.connection.on('error', (error: Error) => {
  const loggerContext = Logger.getContext('startup');

  loggerContext.error('MongoDB connection error', error);

  return process.exit(1);
});

//PubSub configuration
const pubSubConfig = {
  api_end_point: config.get('internal_pubSub.api_end_point'),
  enable_message_ordering: true,
  env: process.env.NODE_ENV || 'development',
  auth: config.get('pubSubAuth'),
  topics: config.get('internal_pubSub.topics')
};

MessagePublisher.configure(pubSubConfig);

//setup logger
Logger.setup(config.get('logger'));
const loggerContext = Logger.getContext('ChangeStream Setup');

/**
 * Gets configured resume token manager class
 *
 */
const getTokenCollectionManager = async () => {
  const manager = new EventStoreProjectionResumeTokenCollectionManager();
  const db = await MongoClients.getInstance().getClientDatabase(loggerContext, AGENCY_CLIENT_MANAGEMENT_DB_KEY);

  manager.setDatabase(db);
  manager.setCollectionName(StreamTracker);

  return manager;
};
/**
 * Starts all the watchers aka change streams that have been registered
 */
const attachWatchers = async () => {
  const tokenManager = await getTokenCollectionManager();
  const watcherContext = new EventStoreWatcherContext();

  await watcherContext.watch(PIPELINE_TYPES_ENUM.CORE, Logger.getContext(), MongoClients.getInstance(), tokenManager);
};

// Lets register streaming application connections
MongoClients.getInstance().registerClientConfigs([AGENCY_CLIENT_MANAGEMENT_DB_KEY]);

attachWatchers().catch((err) => {
  loggerContext.error('There was an error while attaching the watchers', err);
  process.exit(1);
});
