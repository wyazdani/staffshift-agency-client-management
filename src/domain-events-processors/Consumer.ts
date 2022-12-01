import {IncomingDomainEvents} from '../models/IncomingDomainEvents';
import {AgencyClientLinkStatus} from './AgencyClientLinkStatus';
import {LoggerContext} from 'a24-logzio-winston';
import {JWTSecurityHelper} from '../helpers/JWTSecurityHelper';
import {EventMetaInterface, EventRepository} from '../EventRepository';
import {v4 as uuidv4} from 'uuid';
import {EventStore} from '../models/EventStore';
import {FacadeClientHelper} from '../helpers/FacadeClientHelper';
import config from 'config';
import {AgencyClientLinkDomainEventDataInterface} from 'AgencyClientLinkDomainEventDataInterface';
import {DomainEventMessageInterface} from 'DomainEventTypes/DomainEventMessageInterface';
import {PubSubMessageMetaDataInterface} from 'PubSubMessageMetaDataInterface';
import {AgencyRepository} from '../aggregates/Agency/AgencyRepository';
import {AgencyWriteProjectionHandler} from '../aggregates/Agency/AgencyWriteProjectionHandler';
import {CommandBus} from '../aggregates/CommandBus';

const getEventMeta = async (logger: LoggerContext, token: string): Promise<EventMetaInterface> =>
  new Promise((resolve, reject) =>
    JWTSecurityHelper.jwtVerification(token, config.get<string>('ss_domain_event.jwt_secret'), (err, response) => {
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

const process = async (
  logger: LoggerContext,
  message: DomainEventMessageInterface<AgencyClientLinkDomainEventDataInterface>
) => {
  const eventName = message.event.name;
  const correlationId = uuidv4();
  const eventMeta = await getEventMeta(logger, message.application_jwt);
  const eventRepository = new EventRepository(EventStore, correlationId, eventMeta);
  const commandBus = new CommandBus(eventRepository, logger);

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
      const facadeClientHelper = new FacadeClientHelper(logger);
      const handler = new AgencyClientLinkStatus(logger, commandBus, facadeClientHelper);

      return handler.apply(message);
    }
    default:
      logger.info('UnHandled Agency Client Event', {event_name: eventName});
  }
};

module.exports = async (
  logger: LoggerContext,
  message: DomainEventMessageInterface<AgencyClientLinkDomainEventDataInterface>,
  metadata: PubSubMessageMetaDataInterface,
  callback: (error?: Error) => void
): Promise<void> => {
  process(logger, message)
    .then(() => IncomingDomainEvents.create(message))
    .then(() => callback())
    .catch((err) => callback(err));
};
