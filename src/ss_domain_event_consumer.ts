import config from 'config';
import Logger from 'a24-logzio-winston';
Logger.setup(config.get('logger')); // Setup logger
const loggerContext = Logger.getContext('startup');
import mongoose, {ConnectOptions} from 'mongoose';
mongoose.Promise = global.Promise;

import {MessageProcessor} from 'a24-node-pubsub';
import {GenericObjectInterface} from 'GenericObjectInterface';

const mongooseErrorCallback = (error: Error) => {
  const loggerContext = Logger.getContext('startup');
  loggerContext.error('MongoDB connection error', error);
  return process.exit(1);
};

mongoose
  .connect(config.get<GenericObjectInterface>('mongo').database_host as string,
    config.get<GenericObjectInterface>('mongo').options as ConnectOptions)
  .catch(mongooseErrorCallback);

mongoose.connection.on('error', mongooseErrorCallback);

// Setup message processor
const processorConfig = {
  env: process.env.NODE_ENV || 'development',
  auth: config.get('pubSubAuth'),
  topics: config.get('ss_domain_event.ss_domain_event_topics'),
  domain: config.get('app_domain'),
  app_name: config.get('app_name'),
  log_level: config.get('pubsub_log_level')
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