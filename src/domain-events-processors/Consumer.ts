import {IncomingDomainEvents} from '../models/IncomingDomainEvents';
import {AgencyClientLinkStatus} from './AgencyClientLinkStatus';
import {LoggerContext} from 'a24-logzio-winston';
import {GenericObjectInterface} from 'GenericObjectInterface';

export default async (
  logger: typeof LoggerContext,
  message: GenericObjectInterface,
  metadata: GenericObjectInterface,
  callback: (error?: Error) => void): Promise<void> => {

  process(logger, message)
    .then(() =>
      // create does not do new and set a _id value, using insertMany instead
      IncomingDomainEvents.insertMany(message)
    )
    .then(() => {
      callback();
    })
    .catch((err) => {
      callback(err);
    });
};

const process = async (logger: typeof LoggerContext, message: GenericObjectInterface) => {
  const eventName = (message.event as GenericObjectInterface).name as string;

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
      const handler = new AgencyClientLinkStatus(logger);
      return handler.apply(message);
    }
    default:
      console.log({event_name: eventName});
      logger.info('UnHandled Agency Client Event', {event_name: eventName});
  }
};
