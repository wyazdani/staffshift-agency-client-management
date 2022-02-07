import Logger from 'a24-logzio-winston';
import config from 'config';
import {GracefulShutdownConfigurationInterface} from 'GracefulShutdownConfigurationInterface';
import {EventStorePublisherConfigInterface, EventStorePublisher} from 'ss-eventstore';
import {setTimeout} from 'timers/promises';

Logger.setup(config.get('logger'));
const loggerContext = Logger.getContext('event-store-publisher');

const eventStorePublisher = new EventStorePublisher({
  messagePublisher: {
    api_end_point: config.get('event_store.publisher.api_end_point'),
    env: process.env.NODE_ENV || 'development',
    auth: config.get('pubSubAuth')
  },
  mongo: {
    database_host: config.get('event_store.mongo.database_host'),
    options: config.get('event_store.mongo.options')
  },
  publishTopicName: config.get<string>('event_store.publisher.topic_name'),
  pipelineId: config.get<string>('event_store.publisher.pipeline_id')
} as EventStorePublisherConfigInterface);

const shutdown = async (success: boolean) => {
  loggerContext.info('Calling shutdown on event store publisher');
  try {
    await eventStorePublisher.shutdown();
    process.exit(success ? 0 : 1);
  } catch (error) {
    loggerContext.error('Error exiting event store publisher', error);
    await setTimeout(200);
    process.exit(1);
  }
};

eventStorePublisher.on('error', (error) => {
  loggerContext.error('Error in Event Store Publisher', {error});
  shutdown(false);
});

for (const signal of config.get<GracefulShutdownConfigurationInterface>('graceful_shutdown').signals) {
  process.on(signal, () => shutdown(true));
}
(async () => {
  loggerContext.info('starting publisher');
  await eventStorePublisher.start();
  loggerContext.info('publisher started');
})();
