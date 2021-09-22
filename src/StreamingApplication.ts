import {MongoClients} from './streaming_applications/core/MongoClients';
import {AGENCY_CLIENT_MANAGEMENT_DB_KEY} from './streaming_applications/DatabaseConfigKeys';
import {ResumeTokenCollectionManager} from './streaming_applications/core/ResumeTokenCollectionManager';
import {isString} from 'lodash';
import mongoose, {ConnectOptions} from 'mongoose';
import StreamingApplications from './streaming_applications';
import * as config from 'config';
import Logger from 'a24-logzio-winston';
import arg from 'arg';
import {GenericObjectInterface} from 'GenericObjectInterface';
import {PIPELINE_TYPES_ENUM} from './streaming_applications/core/ChangeStreamEnums';

const StreamTracker = 'StreamTracker';

mongoose.plugin((schema: GenericObjectInterface) => {
  schema.options.usePushEach = true;
});
mongoose.Promise = global.Promise;

const mongooseErrorCallback = (error: Error) => {
  const loggerContext = Logger.getContext('startup');

  loggerContext.error('MongoDB connection error', error);

  return process.exit(1);
};

mongoose
  .connect(
    config.get<GenericObjectInterface>('mongo').database_host,
    config.get<GenericObjectInterface>('mongo').options as ConnectOptions
  )
  .catch(mongooseErrorCallback);

mongoose.connection.on('error', mongooseErrorCallback);

const args = arg(
  {
    '--type': String
  },
  {
    argv: process.argv
  }
);

//setup logger
Logger.setup(config.get('logger'));
const loggerContext = Logger.getContext('ChangeStream Setup');

// validate and store ENV
if (!args['--type']) {
  loggerContext.error('Expected --type has not been passed');
  process.exit(1);
}
const CHANGE_STREAM_TYPE = args['--type'].toLowerCase();
/**
 * Gets configured resume token manager class
 *
 * @returns {Promise<ResumeTokenCollectionManager>}
 */
const getTokenCollectionManager = async () => {
  const manager = new ResumeTokenCollectionManager();
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

  for (const watcher of StreamingApplications) {
    const streamLoggerContext = Logger.getContext();

    await watcher.watch(
      CHANGE_STREAM_TYPE as PIPELINE_TYPES_ENUM,
      streamLoggerContext,
      MongoClients.getInstance(),
      tokenManager
    );
  }
};

// Lets register streaming application connections
for (const watcher of StreamingApplications) {
  MongoClients.getInstance().registerClientConfigs(
    watcher.getMongoClientConfigKeys(CHANGE_STREAM_TYPE as PIPELINE_TYPES_ENUM)
  );
}

attachWatchers().catch((err) => {
  loggerContext.error('There was an error while attaching the watchers', err);
  process.exit(1);
});

//Graceful shutdown:
const shutdown = async () => {
  const logger = Logger.getContext('gracefulshutdown');

  logger.info('starting graceful shutdown process');
  try {
    const promiseArray = [];

    for (const watcher of StreamingApplications) {
      promiseArray.push(watcher.shutdown());
    }
    const result = await Promise.race([
      Promise.all(promiseArray),
      new Promise((resolve) =>
        setTimeout(
          () => resolve('can\'t exit in specified time'),
          config.get<GenericObjectInterface>('graceful_shutdown').changestream.server_close_timeout
        )
      )
    ]);

    if (isString(result)) {
      logger.error(result);
      logger.info('stopping forcefully');
    } else {
      logger.info('server stopped gracefully');
    }
    await Logger.close();
    let memoryLog = 'Memory Usage: ';
    const used: any = process.memoryUsage();

    for (const key in used) {
      memoryLog += ` ${key}: ${Math.round((used[key] / 1024 / 1024) * 100) / 100}MB`;
    }
    process.exit(0);
  } catch (err) {
    logger.error('could not do graceful shutdown in the specified time, exiting forcefully', err);
    process.exit(1);
  }
};

for (const signal of config.get<GenericObjectInterface>('graceful_shutdown').signals) {
  process.on(signal, shutdown);
}
