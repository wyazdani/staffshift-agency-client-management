import config from 'config';
import Logger from 'a24-logzio-winston';
import {cloneDeep} from 'lodash';
import {GracefulShutdownConfigurationInterface} from 'GracefulShutdownConfigurationInterface';
import {MongoConfigurationInterface} from 'MongoConfigurationInterface';
import mongoose from 'mongoose';
import {EventStoreListener} from 'ss-eventstore';
import {setTimeout} from 'timers/promises';

Logger.setup(config.get('logger'));
const loggerContext = Logger.getContext('event-store-listener');
const mongoConfig = cloneDeep(config.get<MongoConfigurationInterface>('mongo'));

// Mongoose configuration for listeners
mongoose.Promise = global.Promise;
mongoose.connect(mongoConfig.database_host, mongoConfig.options);
mongoose.connection.on('error', (error: Error) => {
  const loggerContext = Logger.getContext('startup');

  loggerContext.error('MongoDB connection error', error);

  return process.exit(1);
});

const eventStoreListener = new EventStoreListener({
  messageProcessor: {
    env: process.env.NODE_ENV || 'development',
    auth: config.get('pubSubAuth'),
    domain: config.get('app_domain'),
    app_name: config.get('app_name')
  },
  mongo: {
    database_host: config.get('event_store.mongo.database_host'),
    options: config.get('event_store.mongo.options')
  },
  listeners: config.get('event_store.listener.listeners')
});

const shutdown = async (success: boolean) => {
  loggerContext.info('Calling shutdown on event store listener');
  try {
    await Promise.race([
      setTimeout(config.get('graceful_shutdown.event_store.server_close_timeout')),
      eventStoreListener.shutdown()
    ]);
    process.exit(success ? 0 : 1);
  } catch (error) {
    loggerContext.error('Error exiting event store listener', error);
    await setTimeout(200);
    process.exit(1);
  }
};

eventStoreListener.on('error', (error) => {
  loggerContext.error('Error in Event Store Listener', {error});
  shutdown(false);
});

for (const signal of config.get<GracefulShutdownConfigurationInterface>('graceful_shutdown').signals) {
  process.on(signal, () => shutdown(true));
}

(async () => {
  loggerContext.info('Starting listeners');
  await eventStoreListener.start();
  loggerContext.info('listeners started');
})();
