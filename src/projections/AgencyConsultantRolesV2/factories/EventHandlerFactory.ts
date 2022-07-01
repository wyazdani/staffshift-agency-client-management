import {LoggerContext} from 'a24-logzio-winston';
import {RuntimeError} from 'a24-node-error-utils';
import {
  AgencyConsultantRoleAddedEventStoreDataInterface,
  AgencyConsultantRoleDetailsUpdatedEventStoreDataInterface,
  AgencyConsultantRoleDisabledEventStoreDataInterface,
  AgencyConsultantRoleEnabledEventStoreDataInterface,
  BaseEventStoreDataInterface
} from 'EventTypes';
import {EventHandlerInterface} from 'EventHandlerInterface';
import {EventsEnum} from '../../../Events';
import {AgencyConsultantRoleAddedEventHandler} from '../event-handlers/AgencyConsultantRoleAddedEventHandler';
import {EventStorePubSubModelInterface} from 'ss-eventstore/dist/declarations';
import {FilterQuery} from 'mongoose';
import {AgencyConsultantRolesProjectionV2DocumentType} from '../../../models/AgencyConsultantRolesProjectionV2';
import {AgencyConsultantRoleDetailsUpdatedEventHandler} from '../event-handlers/AgencyConsultantRoleDetailsUpdatedEventHandler';
import {AgencyConsultantRoleEnabledEventHandler} from '../event-handlers/AgencyConsultantRoleEnabledEventHandler';
import {AgencyConsultantRoleDisabledEventHandler} from '../event-handlers/AgencyConsultantRoleDisabledEventHandler';

type SupportedEventsDataType =
  | AgencyConsultantRoleAddedEventStoreDataInterface
  | AgencyConsultantRoleDisabledEventStoreDataInterface
  | AgencyConsultantRoleEnabledEventStoreDataInterface
  | AgencyConsultantRoleDetailsUpdatedEventStoreDataInterface;
/**
 * Responsible for building different event handlers
 */
export class EventHandlerFactory {
  /**
   * Return event handler based on the event type
   */
  static getHandler(
    eventType: EventsEnum,
    logger: LoggerContext,
    event: EventStorePubSubModelInterface
  ): EventHandlerInterface<BaseEventStoreDataInterface> {
    logger.debug('Processing the incoming event', {event: event.type});
    const criteria: FilterQuery<AgencyConsultantRolesProjectionV2DocumentType> = {
      agency_id: event.aggregate_id.agency_id as string
    };

    const eventData = event.data as SupportedEventsDataType;

    if (eventData._id) {
      criteria._id = eventData._id;
    }
    switch (eventType) {
      case EventsEnum.AGENCY_CONSULTANT_ROLE_ADDED:
        return new AgencyConsultantRoleAddedEventHandler(logger);
      case EventsEnum.AGENCY_CONSULTANT_ROLE_ENABLED:
        return new AgencyConsultantRoleEnabledEventHandler(logger);
      case EventsEnum.AGENCY_CONSULTANT_ROLE_DISABLED:
        return new AgencyConsultantRoleDisabledEventHandler(logger);
      case EventsEnum.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED:
        return new AgencyConsultantRoleDetailsUpdatedEventHandler(logger);
      default:
        logger.error('No configured handler found for this event', {eventType});
        throw new RuntimeError(`No configured handler found for this event: ${eventType}`);
    }
  }
}
