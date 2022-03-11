import config from 'config';
import Logger from 'a24-logzio-winston';
import {GracefulShutdownConfigurationInterface} from 'GracefulShutdownConfigurationInterface';
import mongoose from 'mongoose';
import {MongoConfigurationInterface} from 'MongoConfigurationInterface';
import {EventStoreHttpClient} from 'ss-eventstore';
import {BulkProcessManager} from './BulkProcessManager/BulkProcessManager';
import {setTimeout} from 'timers/promises';

Logger.setup(config.get('logger')); // Setup logger
const loggerContext = Logger.getContext('bulk-process-manager');

mongoose.Promise = global.Promise;

const mongoConfig = config.get<MongoConfigurationInterface>('mongo');

mongoose.connect(mongoConfig.database_host, mongoConfig.options);

mongoose.connection.on('error', (error: Error) => {
  const loggerContext = Logger.getContext('startup');

  loggerContext.error('MongoDB connection error', error);

  return process.exit(1);
});
(async () => {
  try {
    const eventStoreHttpClient = new EventStoreHttpClient(loggerContext, {
      issuer_service_name: config.get('app_name'),
      ...config.get('event_store.projection.staffshift-agency-client-management-event-store')
    });
    const processManager = new BulkProcessManager(loggerContext, {
      parallel_limit: config.get<number>('bulk_process_manager.parallel_limit'),
      polling_interval: config.get<number>('bulk_process_manager.polling_interval'),
      eventStoreHttpClient
    });

    const shutdown = async () => {
      loggerContext.info('Exiting process');
      await Promise.race([
        setTimeout(config.get('graceful_shutdown.bulk_process_manager.server_close_timeout')),
        processManager.shutdown()
      ]);
      loggerContext.info('Process exited gracefully');
      process.exit(0);
    };

    for (const signal of config.get<GracefulShutdownConfigurationInterface>('graceful_shutdown').signals) {
      process.on(signal, shutdown);
    }

    await processManager.start();
  } catch (error) {
    loggerContext.error('Error in Bulk Process Manager index file', error);
    Logger.close();
    process.exit(1);
  }
})();
