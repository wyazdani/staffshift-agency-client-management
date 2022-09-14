import Logger from 'a24-logzio-winston';
import config from 'config';
import {MongoConfigurationInterface} from 'MongoConfigurationInterface';
import mongoose from 'mongoose';
import {SeedingJob} from 'ss-eventstore';
import {cloneDeep} from 'lodash';

Logger.setup(config.get('logger'));
const loggerContext = Logger.getContext('event-store-seed');

// Mongoose configuration for projections
mongoose.Promise = global.Promise;
const mongoConfig = cloneDeep(config.get<MongoConfigurationInterface>('mongo'));

mongoose.connect(mongoConfig.database_host, mongoConfig.options);
mongoose.connection.on('error', (error: Error) => {
  const loggerContext = Logger.getContext('startup');

  loggerContext.error('MongoDB connection error', error);

  return process.exit(1);
});

(async () => {
  try {
    const seedJob = await SeedingJob.createInstance({
      bindingId: 'agency-client-payment-terms-v1',
      eventStoreHttpClientConfig: {
        ...config.get('event_store.listener.staffshift-agency-client-management-event-store'),
        issuer_service_name: config.get('app_name')
      },
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
      listenerFilePath: './AgencyClientPaymentTermsProjector',
      topicName: 'ss.global.event.store.staffshift.agency.client.management'
    });

    loggerContext.info('Starting to seed');
    await seedJob.seed();
    loggerContext.info('Seed is done');
    process.exit(0);
  } catch (error) {
    loggerContext.error('Error in seed', error);
    process.exit(1);
  }
})();
