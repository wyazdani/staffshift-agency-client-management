import {IncomingDomainEvents} from '../models/IncomingDomainEvents';
import {AgencyClientLinkStatus} from './AgencyClientLinkStatus';
import {LoggerContext} from 'a24-logzio-winston';
import {JWTSecurityHelper} from '../helpers/JWTSecurityHelper';
import {EventMeta, EventRepository} from '../EventRepository';
import {v4 as uuidv4} from 'uuid';
import {EventStore} from '../models/EventStore';
import {AgencyClientCommandBusFactory} from '../factories/AgencyClientCommandBusFactory';
const config = require('config');

module.exports = async (logger: LoggerContext, message: any, metadata: any, callback: Function) => {
  process(logger, message)
    .then(() => IncomingDomainEvents.create(message))
    .then(() => {
      callback();
    })
    .catch((err) => {
      callback(err);
    });
};

async function process(logger: LoggerContext, message: any) {
  const correlationId = uuidv4();
  const eventMeta = await getEventMeta(logger, message.application_jwt);
  const eventRepository = new EventRepository(EventStore, correlationId, eventMeta);
  logger.info('Handling incoming domain event', {correlation_id: correlationId, event_id: message.event.id});
  switch (message.event.name) {
    case 'agency_organisation_link_created':
    case 'agency_organisation_link_deleted':
    case 'agency_organisation_link_status_changed':
    case 'agency_organisation_site_link_created':
    case 'agency_organisation_site_link_deleted':
    case 'agency_organisation_site_link_status_changed':
    case 'agency_organisation_site_ward_link_created':
    case 'agency_organisation_site_ward_link_deleted':
    case 'agency_organisation_site_ward_link_status_changed': {
      const agencyClientCommandBus = AgencyClientCommandBusFactory.getCommandBus(eventRepository);
      const handler = new AgencyClientLinkStatus(logger, agencyClientCommandBus);
      return handler.apply(message);
    }
    default:
      console.log({event_name: message.event.name});
      logger.info('UnHandled Agency Client Event', {event_name: message.event.name});
  }
}

const getEventMeta = async (logger: LoggerContext, token:string): Promise<EventMeta> => {
  return new Promise((resolve, reject) => {
    return JWTSecurityHelper.jwtVerification(token, config.api_token, (err, response) => {
      if (err) {
        return reject(err);
      }
      resolve({user_id: response.decoded.sub || 'system', client_id: response.decoded.client_id, context: response.decoded.context});
    });
  });
};
