import {IncomingDomainEvents} from '../models/IncomingDomainEvents';
import {AgencyClientLinkStatus} from './AgencyClientLinkStatus';
import {LoggerContext} from 'a24-logzio-winston';

module.exports = async (logger: LoggerContext, message: any, metadata: any, callback: Function) => {
  process(logger, message)
    .then(() => {
      // create does not do new and set a _id value, using insertMany instead
      return IncomingDomainEvents.insertMany(message);
    })
    .then(() => {
      callback();
    })
    .catch((err) => {
      callback(err);
    });
};

async function process(logger: LoggerContext, message: any) {
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
      const handler = new AgencyClientLinkStatus(logger);
      return handler.apply(message);
    }
    default:
      console.log({event_name: message.event.name});
      logger.info('UnHandled Agency Client Event', {event_name: message.event.name});
  }
}
