import config from 'config';
import Logger from 'a24-logzio-winston';
import {MessageProcessor} from 'a24-node-pubsub';
import {toNumber} from 'lodash';
import mongoose from 'mongoose';
import {MongoConfigurationInterface} from 'MongoConfigurationInterface';

Logger.setup(config.get('logger')); // Setup logger
const loggerContext = Logger.getContext('startup');

mongoose.Promise = global.Promise;

const mongoConfig = config.get<MongoConfigurationInterface>('mongo');

mongoose.connect(mongoConfig.database_host, mongoConfig.options);

mongoose.connection.on('error', (error: Error) => {
  const loggerContext = Logger.getContext('startup');

  loggerContext.error('MongoDB connection error', error);

  return process.exit(1);
});

//Validation check
const CONSUMER_NAME = process.argv[2];
const MIN_DELAY = toNumber(process.argv[3]);
const MAX_DELAY = toNumber(process.argv[4]);

if (!MIN_DELAY) {
  throw 'MIN DELAY is not set';
}
if (!MAX_DELAY) {
  throw 'MAX DELAY is not set';
}
if (!CONSUMER_NAME) {
  throw 'CONSUMER NAME is not set';
}

// Setup message processor
const processorConfig = {
  env: process.env.NODE_ENV || 'development',
  auth: config.get('pubSubAuth'),
  topics: config.get('internal_pubSub.topics'),
  domain: config.get('app_domain'),
  app_name: config.get('app_name')
};
const mp = new MessageProcessor(processorConfig);

// Add event listeners for message processor
mp.on('error', (err: Error) => {
  loggerContext.error('Fatal message consumption error', err);
  process.exit(1);
});

mp.configure((err: Error) => {
  if (err) {
    loggerContext.error('Google pubsub configuration error', err);

    return process.exit(1);
  }

  mp.attach();
});
