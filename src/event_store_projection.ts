import config from 'config';
import Logger from 'a24-logzio-winston';
import {GracefulShutdownConfigurationInterface} from 'GracefulShutdownConfigurationInterface';
import {MongoConfigurationInterface} from 'MongoConfigurationInterface';
import mongoose from 'mongoose';
import {EventStoreProjection} from 'ss-eventstore';
import {setTimeout} from 'timers/promises';

Logger.setup(config.get('logger'));
const loggerContext = Logger.getContext('event-store-projection');

// Mongoose configuration for projections
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

const projection = new EventStoreProjection({
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
  projections: config.get('event_store.projection.projections')
});

const shutdown = async (success: boolean) => {
  loggerContext.info('Calling shutdown on event store projection');
  try {
    await Promise.race([
      setTimeout(config.get('graceful_shutdown.event_store.server_close_timeout')),
      projection.shutdown()
    ]);
    process.exit(success ? 0 : 1);
  } catch (error) {
    loggerContext.error('Error exiting event store projection', error);
    await setTimeout(200);
    process.exit(1);
  }
};

projection.on('error', (error) => {
  loggerContext.error('Error in Event Store Projection', {error});
  shutdown(false);
});

for (const signal of config.get<GracefulShutdownConfigurationInterface>('graceful_shutdown').signals) {
  process.on(signal, () => shutdown(true));
}

(async () => {
  loggerContext.info('Starting Projections');
  await projection.start();
  loggerContext.info('projection started');
})();
