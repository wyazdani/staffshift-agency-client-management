'use strict';
const config = require('config');
const Logger = require('a24-logzio-winston');
const {MessageProcessor, MessagePublisher} = require('a24-node-pubsub');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

Logger.setup(config.logger);

mongoose.connect(config.mongo.database_host, config.mongo.options);
mongoose.connection.on(
  'error',
  function mongooseConnection(error) {
    let loggerContext = Logger.getContext('startup');
    loggerContext.error('MongoDB connection error', error);
    return process.exit(1);
  }
);

const pubsubConfig = {
  env: process.env.NODE_ENV || 'development',
  auth: config.get('pubSubAuth'),
  topics: config.get('pubSubTopics'),
  domain: config.get('app_domain'),
  app_name: config.get('app_name')
};

MessagePublisher.configure(pubsubConfig);

let mp = new MessageProcessor(pubsubConfig);
mp.configure(function configureDone(err) {
  if (err) {
    let loggerContext = Logger.getContext('startup');
    loggerContext.error('Google pubsub configuration error', err);
    return process.exit(1);
  }

  mp.attach();
});

mp.on('error', function messageProcessorErrorHandler(err) {
  let loggerContext = Logger.getContext('startup');
  loggerContext.error('Fatal message consumption error', err);
  process.exit(1);
});
