import {IncomingDomainEvents} from '../models/IncomingDomainEvents';
import {AgencyClientLinkStatus} from './AgencyClientLinkStatus';
import {LoggerContext} from 'a24-logzio-winston';
import {GenericObjectInterface} from 'GenericObjectInterface';
import {JWTSecurityHelper} from '../helpers/JWTSecurityHelper';
import {EventMetaInterface, EventRepository} from '../EventRepository';
import {v4 as uuidv4} from 'uuid';
import {EventStore} from '../models/EventStore';
import {AgencyClientCommandBusFactory} from '../factories/AgencyClientCommandBusFactory';
import config from 'config';

export default async (
  logger: typeof LoggerContext,
  message: GenericObjectInterface,
  metadata: GenericObjectInterface,
  callback: (error?: Error) => void
): Promise<void> => {
  process(logger, message)
    .then(() => IncomingDomainEvents.create(message))
    .then(() => callback())
    .catch((err) => callback(err));
};

const process = async (logger: typeof LoggerContext, message: GenericObjectInterface) => {
  const eventName = (message.event as GenericObjectInterface).name as string;
  const correlationId = uuidv4();
  const eventMeta = await getEventMeta(logger, message.application_jwt);
  const eventRepository = new EventRepository(EventStore, correlationId, eventMeta);

  logger.info('Handling incoming domain event', {correlation_id: correlationId, event_id: message.event.id});

  switch (eventName) {
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
      logger.info('UnHandled Agency Client Event', {event_name: eventName});
  }
};
const getEventMeta = async (logger: typeof LoggerContext, token: string): Promise<EventMetaInterface> =>
  new Promise((resolve, reject) =>
    JWTSecurityHelper.jwtVerification(token, config.get<string>('api_token'), (err, response) => {
      if (err) {
        return reject(err);
      }
      resolve({
        user_id: response.decoded.sub || 'system',
        client_id: response.decoded.client_id,
        context: response.decoded.context
      });
    })
  );
