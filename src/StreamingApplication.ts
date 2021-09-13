import {MongoClients} from './streaming_applications/core/MongoClients';
import {AGENCY_CLIENT_MANAGEMENT_DB_KEY} from './streaming_applications/DatabaseConfigKeys';
import {ResumeTokenCollectionManager} from './streaming_applications/core/ResumeTokenCollectionManager';
import {isString} from 'lodash';
import mongoose from 'mongoose';
import StreamingApplications from './streaming_applications';
const config = require('config');
const StreamTracker = 'StreamTracker';
const Logger = require('a24-logzio-winston');
const arg = require('arg');

mongoose.plugin((schema: any) => { schema.options.usePushEach = true; });
mongoose.Promise = global.Promise;
mongoose.connect(config.mongo.database_host, config.mongo.options);
mongoose.connection.on(
  'error',
  function mongooseConnection(error) {
    const loggerContext = Logger.getContext('startup');
    loggerContext.crit('MongoDB connection error', error);
    process.exit(1);
  }
);

const args = arg({
  '--type': String,
  '--name': String
}, {
  argv: process.argv
});

//setup logger
Logger.setup(config.get('logger'));
const loggerContext = Logger.getContext('ChangeStream Setup');
let appFound = false;

// validate and store ENV
if (!args['--type']) {
  loggerContext.error('Expected --type has not been passed');
  process.exit(1);
}
if (!args['--name']) {
  loggerContext.error('Expected --name has not been passed');
  process.exit(1);
}
const CHANGE_STREAM_TYPE = args['--type'].toLowerCase();
const STREAMING_APP_NAME = args['--name'].toLowerCase();

/**
 * Gets configured resume token manager class
 *
 * @returns {Promise<ResumeTokenCollectionManager>}
 */
async function getTokenCollectionManager() {
  const manager = new ResumeTokenCollectionManager();
  const db = await MongoClients.getInstance().getClientDatabase(loggerContext, AGENCY_CLIENT_MANAGEMENT_DB_KEY);
  manager.setDatabase(db);
  manager.setCollectionName(StreamTracker);
  return manager;
}

/**
 * Starts all the watchers aka change streams that have been registered
 */
async function attachWatchers() {
  if (appFound) {
    const tokenManager = await getTokenCollectionManager();
    for (const watcher of StreamingApplications) {
      if (watcher.getStreamingAppName().toLowerCase() === STREAMING_APP_NAME) {
        await watcher.watch(CHANGE_STREAM_TYPE, loggerContext, MongoClients.getInstance(), tokenManager);
      }
    }
  }
}

// Lets register streaming application connections
for (const watcher of StreamingApplications) {
  if (watcher.getStreamingAppName().toLowerCase() === STREAMING_APP_NAME) {
    appFound = true;
    MongoClients.getInstance().registerClientConfigs(watcher.getMongoClientConfigKeys(CHANGE_STREAM_TYPE));
  }
}

attachWatchers().catch((err) => {
  loggerContext.error('There was an error while attaching the watchers', err);
  process.exit(1);
});

//Graceful shutdown:
async function shutdown() {
  const logger = Logger.getContext('gracefulshutdown');
  logger.info('starting graceful shutdown process');
  try {
    const promiseArray = [];
    for (const watcher of StreamingApplications) {
      if (watcher.getStreamingAppName().toLowerCase() === STREAMING_APP_NAME) {
        promiseArray.push(watcher.shutdown());
      }
    }
    const result = await Promise.race([Promise.all(promiseArray),
      new Promise((resolve) => setTimeout(() => resolve('can\'t exit in specified time'), config.get('graceful_shutdown.changestream.server_close_timeout')))]);
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
      memoryLog += ` ${key}: ${Math.round(used[key] / 1024 / 1024 * 100) / 100}MB`;
    }
    console.log(memoryLog);
    process.exit(0);
  } catch (err) {
    logger.error('could not do graceful shutdown in the specified time, exiting forcefully', err);
    process.exit(1);
  }
}
for (const signal of config.get('graceful_shutdown.signals')) {
  process.on(signal, shutdown);
}