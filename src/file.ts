import {cloneDeep} from 'lodash';
import {CommandBus} from './aggregates/CommandBus';
import {PaymentTermCommandEnum} from './aggregates/PaymentTerm/types';
import {
  ApplyPaymentTermCommandInterface,
  ApplyInheritedPaymentTermCommandInterface
} from './aggregates/PaymentTerm/types/CommandTypes';
import {ObjectID} from 'mongodb';
import {PAYMENT_TERM_ENUM} from './aggregates/PaymentTerm/types/PaymentTermAggregateRecordInterface';
import {EventRepository} from './EventRepository';
import {EventStore} from './models/EventStore';
import config from 'config';
import Logger, {SetupOptions} from 'a24-logzio-winston';
import mongoose, {Error} from 'mongoose';
import {MongoConfigurationInterface} from 'MongoConfigurationInterface';
import {
  CompleteApplyPaymentTermCommandInterface,
  CompleteInheritPaymentTermCommandInterface,
  InitiateApplyPaymentTermCommandInterface,
  InitiateInheritPaymentTermCommandInterface
} from './aggregates/OrganisationJob/types/CommandTypes';
import {OrganisationJobCommandEnum} from './aggregates/OrganisationJob/types';

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
  const agencyId = 'agency_id';
  const organisationId = 'organisation_id';
  const clientId = 'client_id';
  const id = 'id';
  const payload = {
    term: 'credit'
  };
  const command: InitiateApplyPaymentTermCommandInterface = {
    aggregateId: {
      name: 'organisation_job',
      agency_id: agencyId,
      organisation_id: organisationId
    },
    type: OrganisationJobCommandEnum.INITIATE_APPLY_PAYMENT_TERM,
    data: {
      _id: id,
      client_id: clientId,
      ...payload
    }
  };
  //it should succeed:

  await commandBus.execute(command);

  // it should throw an exception when ran second time:
  //await commandBus.execute(command);

  // CompletePaymentTerm Success

  // it should succeed
  const completeCommand: CompleteApplyPaymentTermCommandInterface = {
    aggregateId: {
      name: 'organisation_job',
      agency_id: agencyId,
      organisation_id: organisationId
    },
    type: OrganisationJobCommandEnum.COMPLETE_APPLY_PAYMENT_TERM,
    data: {
      _id: id
    }
  };

  //await commandBus.execute(completeCommand);

  // Initiate Inherit Command
  // it should succeed
  const inheritCommand: InitiateInheritPaymentTermCommandInterface = {
    aggregateId: {
      name: 'organisation_job',
      agency_id: agencyId,
      organisation_id: organisationId
    },
    type: OrganisationJobCommandEnum.INITIATE_INHERIT_PAYMENT_TERM,
    data: {
      _id: id,
      client_id: clientId
    }
  };

  //await commandBus.execute(inheritCommand);

  // CompletePaymentTerm Success

  // it should succeed
  const completeInheritCommand: CompleteInheritPaymentTermCommandInterface = {
    aggregateId: {
      name: 'organisation_job',
      agency_id: agencyId,
      organisation_id: organisationId
    },
    type: OrganisationJobCommandEnum.COMPLETE_INHERIT_PAYMENT_TERM,
    data: {
      _id: id
    }
  };

  await commandBus.execute(completeInheritCommand);
  loggerContext.info('finished');
  process.exit(0);
});
