import {LoggerContext} from 'a24-logzio-winston';
import {RuntimeError} from 'a24-node-error-utils';
import {BaseEventStoreDataInterface} from 'EventStoreDataTypes';
import {AgencyRepository} from '../../../Agency/AgencyRepository';
import {EventRepository} from '../../../EventRepository';
import {EventHandlerInterface} from '../types/EventHandlerInterface';
import {AgencyClientConsultantAssignedEventHandler} from '../event-handlers/AgencyClientConsultantAssignedEventHandler';
import {AgencyClientConsultantUnassignedEventHandler} from '../event-handlers/AgencyClientConsultantUnassignedEventHandler';
import {AgencyConsultantRoleDetailsUpdatedEventHandler} from '../event-handlers/AgencyConsultantRoleDetailsUpdatedEventHandler';
import {AgencyWriteProjectionHandler} from '../../../Agency/AgencyWriteProjection';
import {EventsEnum} from '../../../Events';

/**
 * Responsible for building different event handlers
 */
export class EventHandlerFactory {
  /**
   * Return event handler based on the event type
   */
  static getHandler(
    eventType: EventsEnum,
    eventRepository: EventRepository,
    logger: LoggerContext
  ): EventHandlerInterface<BaseEventStoreDataInterface> {
    switch (eventType) {
      case EventsEnum.AGENCY_CLIENT_CONSULTANT_ASSIGNED:
        return new AgencyClientConsultantAssignedEventHandler(
          new AgencyRepository(eventRepository, new AgencyWriteProjectionHandler())
        );
      case EventsEnum.AGENCY_CLIENT_CONSULTANT_UNASSIGNED:
        return new AgencyClientConsultantUnassignedEventHandler();
      case EventsEnum.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED:
        return new AgencyConsultantRoleDetailsUpdatedEventHandler();
      default:
        logger.error('No configured handler found for this event', {eventType});
        throw new RuntimeError(`No configured handler found for this event: ${eventType}`);
    }
  }
}
