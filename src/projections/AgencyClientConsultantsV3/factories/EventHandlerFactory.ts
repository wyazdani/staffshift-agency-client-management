import {LoggerContext} from 'a24-logzio-winston';
import {RuntimeError} from 'a24-node-error-utils';
import {BaseEventStoreDataInterface} from 'EventStoreDataTypes';
import {AgencyRepository} from '../../../aggregates/Agency/AgencyRepository';
import {EventRepository} from '../../../EventRepository';
import {EventHandlerInterface} from 'EventHandlerInterface';
import {AgencyClientConsultantAssignedEventHandler} from '../event-handlers/AgencyClientConsultantAssignedEventHandler';
import {AgencyClientConsultantUnassignedEventHandler} from '../event-handlers/AgencyClientConsultantUnassignedEventHandler';
import {AgencyConsultantRoleDetailsUpdatedEventHandler} from '../event-handlers/AgencyConsultantRoleDetailsUpdatedEventHandler';
import {AgencyWriteProjectionHandler} from '../../../aggregates/Agency/AgencyWriteProjectionHandler';
import {EventsEnum} from '../../../Events';
import {FacadeClientHelper} from '../../../helpers/FacadeClientHelper';

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
          logger,
          new AgencyRepository(eventRepository, new AgencyWriteProjectionHandler()),
          new FacadeClientHelper(logger)
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
