import {cloneDeep} from 'lodash';
import {CommandBus} from '../aggregates/CommandBus';
import {FinancialHoldCommandEnum} from '../aggregates/FinancialHold/types';
import {EventRepository} from '../EventRepository';
import {EventStore} from '../models/EventStore';
import config from 'config';
import Logger, {SetupOptions, LoggerContext} from 'a24-logzio-winston';
import mongoose, {Error} from 'mongoose';
import {MongoConfigurationInterface} from 'MongoConfigurationInterface';

/**
 * ---- ONLY FOR DEV ----
 * By using this file you can run a command on the service
 * We usually use this for testing
 * you only need to define body of `executeCommand` function
 */
const executeCommand = async (logger: LoggerContext, commandBus: CommandBus): Promise<void> => {
  await commandBus.execute({
    aggregateId: {
      name: 'financial_hold',
      agency_id: '5b16b824e8a73a752c42d848',
      client_id: '61b34d00fdaaf07e2e61cdd2'
    },
    type: FinancialHoldCommandEnum.SET_INHERITED_FINANCIAL_HOLD,
    data: {
      financial_hold: null,
      force: true
    }
  });
};

mongoose.Promise = global.Promise;

Logger.setup(config.get<SetupOptions>('logger'));

const mongoConfig = cloneDeep(config.get<MongoConfigurationInterface>('mongo'));

mongoose.connection.on('error', (error: Error) => {
  const loggerContext = Logger.getContext('MongoConnection');

  loggerContext.crit('MongoDB connection error', error);
  process.exit(1);
});
mongoose.connect(mongoConfig.database_host, mongoConfig.options, async (error) => {
  const loggerContext = Logger.getContext('startup');

  if (error) {
    loggerContext.crit('MongoDB connection error', error);
    process.exit(1);
  }

  const eventRepository = new EventRepository(EventStore, 'sample-request-id');
  const commandBus = new CommandBus(eventRepository);

  loggerContext.info('starting');
  await executeCommand(loggerContext, commandBus);
  loggerContext.info('finished');
  process.exit(0);
});
