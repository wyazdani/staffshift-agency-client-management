import {LoggerContext} from 'a24-logzio-winston';
import {RuntimeError} from 'a24-node-error-utils';
import {AgencyClientEventEnum} from '../../../AgencyClient/types';
import {AgencyRepository} from '../../../Agency/AgencyRepository';
import {EventRepository} from '../../../EventRepository';
import {AgencyEventEnum} from '../../../Agency/types';
import {EventHandlerInterface} from '../types/EventHandlerInterface';
import {AgencyClientConsultantAssignedEventHandler} from '../event-handlers/AgencyClientConsultantAssignedEventHandler';
import {AgencyClientConsultantUnassignedEventHandler} from '../event-handlers/AgencyClientConsultantUnassignedEventHandler';
import {AgencyConsultantRoleDetailsUpdatedEventHandler} from '../event-handlers/AgencyConsultantRoleDetailsUpdatedEventHandler';

/**
 * TODO
 */
export class EventHandlerFactory {
  static getHandler(eventType: string, eventRepository: EventRepository, logger: LoggerContext): EventHandlerInterface {
    switch (eventType) {
      case AgencyClientEventEnum.AGENCY_CLIENT_CONSULTANT_ASSIGNED:
        return new AgencyClientConsultantAssignedEventHandler(new AgencyRepository(eventRepository));
      case AgencyClientEventEnum.AGENCY_CLIENT_CONSULTANT_UNASSIGNED:
        return new AgencyClientConsultantUnassignedEventHandler();
      case AgencyEventEnum.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED:
        return new AgencyConsultantRoleDetailsUpdatedEventHandler();
      default:
        logger.info('No configured handler found for this event', {eventType});
        throw new RuntimeError('No configured handler found for this event');
    }
  }
}
