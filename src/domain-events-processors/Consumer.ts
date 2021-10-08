import {IncomingDomainEvents} from '../models/IncomingDomainEvents';
import {AgencyClientLinkStatus} from './AgencyClientLinkStatus';
import {LoggerContext} from 'a24-logzio-winston';
import {JWTSecurityHelper} from '../helpers/JWTSecurityHelper';
import {EventMetaInterface, EventRepository} from '../EventRepository';
import {v4 as uuidv4} from 'uuid';
import {EventStore} from '../models/EventStore';
import {AgencyClientCommandBusFactory} from '../factories/AgencyClientCommandBusFactory';
import {FacadeClientHelper} from '../helpers/FacadeClientHelper';
import config from 'config';
import {AgencyClientLinkDomainEventDataInterface} from 'AgencyClientLinkDomainEventDataInterface';
import {DomainEventMessageInterface} from 'DomainEventMessageInterface';
import {PubSubMessageMetaDataInterface} from 'PubSubMessageMetaDataInterface';
import {AgencyClientAggregateIdInterface, AgencyClientAggregateRecordInterface} from '../AgencyClient/types';
import {AgencyClientCommandDataType} from '../AgencyClient/types/AgencyClientCommandDataType';
import {AgencyRepository} from '../Agency/AgencyRepository';
import {AgencyWriteProjectionHandler} from '../Agency/AgencyWriteProjection';
import {AgencyAggregateIdInterface, AgencyAggregateRecordInterface} from '../Agency/types';
import {AgencyCommandDataType} from '../Agency/types/AgencyCommandDataType';

const getEventMeta = async (logger: LoggerContext, token: string): Promise<EventMetaInterface> =>
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

const process = async (
  logger: LoggerContext,
  message: DomainEventMessageInterface<AgencyClientLinkDomainEventDataInterface>
) => {
  const eventName = message.event.name;
  const correlationId = uuidv4();
  const eventMeta = await getEventMeta(logger, message.application_jwt);
  const eventRepository = new EventRepository<AgencyClientAggregateIdInterface, AgencyClientCommandDataType, AgencyClientAggregateRecordInterface>(EventStore, correlationId, eventMeta);

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
      const agencyClientCommandBus = AgencyClientCommandBusFactory.getCommandBus(
          eventRepository,
          new AgencyRepository(
            new EventRepository<AgencyAggregateIdInterface, AgencyCommandDataType, AgencyAggregateRecordInterface>(EventStore, correlationId, eventMeta),
            new AgencyWriteProjectionHandler()
          )
      );
      const facadeClientHelper = new FacadeClientHelper(logger);
      const handler = new AgencyClientLinkStatus(logger, agencyClientCommandBus, facadeClientHelper);

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
