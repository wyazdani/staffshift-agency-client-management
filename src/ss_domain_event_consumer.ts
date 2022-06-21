import config from 'config';
import Logger from 'a24-logzio-winston';
import {cloneDeep} from 'lodash';
import {MessageProcessor} from 'a24-node-pubsub';
import mongoose from 'mongoose';
import {MongoConfigurationInterface} from 'MongoConfigurationInterface';
import {PubSubAuthConfigurationInterface} from 'PubSubAuthConfigurationInterface';
import {DomainEventConfigurationInterface} from 'DomainEventTypes/DomainEventConfigurationInterface';

Logger.setup(config.get('logger')); // Setup logger
const loggerContext = Logger.getContext('startup');

mongoose.Promise = global.Promise;

const mongoConfig = cloneDeep(config.get<MongoConfigurationInterface>('mongo'));

mongoose.connect(mongoConfig.database_host, mongoConfig.options);

mongoose.connection.on('error', (error: Error) => {
  const loggerContext = Logger.getContext('startup');

  loggerContext.error('MongoDB connection error', error);

  return process.exit(1);
});

// Setup message processor
const processorConfig = {
  env: process.env.NODE_ENV || 'development',
  auth: config.get<PubSubAuthConfigurationInterface>('pubSubAuth'),
  topics: config.get<DomainEventConfigurationInterface[]>('ss_domain_event.ss_domain_event_topics'),
  domain: config.get<string>('app_domain'),
  app_name: config.get<string>('app_name'),
  log_level: config.get<string>('pubsub_log_level')
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
