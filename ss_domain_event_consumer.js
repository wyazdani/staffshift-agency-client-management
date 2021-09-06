'use strict';

const config = require('config');
const Logger = require('a24-logzio-winston');
Logger.setup(config.logger); // Setup logger
const loggerContext = Logger.getContext('startup');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {MessageProcessor} = require('a24-node-pubsub');

mongoose.connect(config.mongo.database_host, config.mongo.options);
mongoose.connection.on(
  'error',
  function mongooseConnection(error) {
    let loggerContext = Logger.getContext('startup');
    loggerContext.error('MongoDB connection error', error);
    return process.exit(1);
  }
);

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
mp.on('error', function messageProcessorErrorHandler(err) {
  loggerContext.error('Fatal message consumption error', err);
  process.exit(1);
});

mp.configure(function configureDone(err) {
  if (err) {
    loggerContext.error('Google pubsub configuration error', err);
    return process.exit(1);
  }

  mp.attach();
});