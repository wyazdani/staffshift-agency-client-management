import Logger from 'a24-logzio-winston';
import config from 'config';
import {GracefulShutdownConfigurationInterface} from 'GracefulShutdownConfigurationInterface';
import {EventStoreHttpServer} from 'ss-eventstore';

Logger.setup(config.get('logger'));
const loggerContext = Logger.getContext('event-store-http-server');
const eventStoreHttpServer = new EventStoreHttpServer({
  apiToken: config.get<string>('event_store.http_server.api_token'),
  mongo: {
    database_host: config.get<string>('event_store.mongo.database_host'),
    options: config.get('event_store.mongo.options')
  },
  server: {port: config.get('event_store.http_server.port')}
});

const shutdown = async () => {
  try {
    loggerContext.info('Starting to shutdown');
    await eventStoreHttpServer.shutdown();
    loggerContext.info('Shutdown done');
    process.exit(0);
  } catch (error) {
    loggerContext.error('Error while shutting down event store http server', error);
    process.exit(1);
  }
};

for (const signal of config.get<GracefulShutdownConfigurationInterface>('graceful_shutdown').signals) {
  process.on(signal, () => shutdown());
}
(async () => {
  loggerContext.info('Starting event store http server');
  await eventStoreHttpServer.start();
  loggerContext.info('http server started');
})();
