import {cloneDeep} from 'lodash';
import {CommandBus} from './aggregates/CommandBus';
import {EventRepository} from './EventRepository';
import {EventStore} from './models/EventStore';
import config from 'config';
import Logger, {SetupOptions} from 'a24-logzio-winston';
import mongoose, {Error} from 'mongoose';
import {MongoConfigurationInterface} from 'MongoConfigurationInterface';
import {BookingPreferenceCommandEnum} from './aggregates/BookingPreference/types';
import {
  SetRequiresPONumberCommandInterface,
  UnsetRequiresPONumberCommandInterface
} from './aggregates/BookingPreference/types/CommandTypes';
import {AddAgencyConsultantRoleCommandInterface} from './aggregates/Agency/types/CommandTypes';
import {AgencyCommandEnum} from './aggregates/Agency/types';
import {
  AddAgencyClientConsultantCommandInterface,
  LinkAgencyClientCommandInterface
} from './aggregates/AgencyClient/types/CommandTypes';
import {AgencyClientCommandEnum} from './aggregates/AgencyClient/types';

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
  const agencyId = '6141caa0d51653b8f4000002';
  const clientId = '61546ad7487f521523000002';

  // const command: LinkAgencyClientCommandInterface = {
  //   aggregateId: {
  //     name: 'agency_client',
  //     client_id: clientId,
  //     agency_id: agencyId
  //   },
  //   type: AgencyClientCommandEnum.LINK_AGENCY_CLIENT,
  //   data: {
  //     client_type: 'organisation'
  //   }
  // };

  // await commandBus.execute(command);
  // const addRolecommand: AddAgencyConsultantRoleCommandInterface = {
  //   aggregateId: {
  //     name: 'agency',
  //     agency_id: agencyId
  //   },
  //   type: AgencyCommandEnum.ADD_AGENCY_CONSULTANT_ROLE,
  //   data: {
  //     _id: '6154703039004ecec7000001',
  //     name: 'random',
  //     description: 'test random description',
  //     max_consultants: 10
  //   }
  // };

  // await commandBus.execute(addRolecommand);

  const addAgencyClientcommand: AddAgencyClientConsultantCommandInterface = {
    aggregateId: {
      name: 'agency_client',
      client_id: clientId,
      agency_id: agencyId
    },
    type: AgencyClientCommandEnum.ADD_AGENCY_CLIENT_CONSULTANT,
    data: {
      _id: '6154754f76a9633a16000001',
      consultant_role_id: '6154703039004ecec7000001',
      consultant_id: '61546b06e078011a14000001'
    }
  };
  //it should succeed:

  await commandBus.execute(addAgencyClientcommand);
  loggerContext.info('finished');
  process.exit(0);
});
