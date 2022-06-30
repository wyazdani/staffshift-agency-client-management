import {LoggerContext} from 'a24-logzio-winston';
import {MongoError} from 'mongodb';
import {FilterQuery} from 'mongoose';
import {EventStoreProjectorInterface, EventStorePubSubModelInterface} from 'ss-eventstore';
import {
  AgencyConsultantRoleAddedEventStoreDataInterface,
  AgencyConsultantRoleDisabledEventStoreDataInterface,
  AgencyConsultantRoleEnabledEventStoreDataInterface,
  AgencyConsultantRoleDetailsUpdatedEventStoreDataInterface
} from 'EventTypes';
import {EventsEnum} from '../../Events';
import {MONGO_ERROR_CODES} from 'staffshift-node-enums';
import {
  AgencyConsultantRolesProjectionV2DocumentType,
  AgencyConsultantRolesProjectionV2
} from '../../models/AgencyConsultantRolesProjectionV2';
import {EventHandlerFactory} from './factories/EventHandlerFactory';

const events = [
  EventsEnum.AGENCY_CONSULTANT_ROLE_ADDED,
  EventsEnum.AGENCY_CONSULTANT_ROLE_ENABLED,
  EventsEnum.AGENCY_CONSULTANT_ROLE_DISABLED,
  EventsEnum.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED
];

/**
 * Projects to AgencyConsultantRoles
 */
export default class AgencyConsultantRolesProjector implements EventStoreProjectorInterface {
  async project(logger: LoggerContext, event: EventStorePubSubModelInterface): Promise<void> {
    if (!events.includes(event.type as EventsEnum)) {
      logger.debug('Incoming event ignored', {event: event.type});
      return;
    }
    const eventType: EventsEnum = event.type as EventsEnum;
    const eventHandler = EventHandlerFactory.getHandler(eventType, logger, event);

    await eventHandler.handle(event);
  }
}
