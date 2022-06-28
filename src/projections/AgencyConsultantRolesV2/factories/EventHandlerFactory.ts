import {LoggerContext} from 'a24-logzio-winston';
import {RuntimeError} from 'a24-node-error-utils';
import {BaseEventStoreDataInterface} from 'EventTypes';
import {EventHandlerInterface} from 'EventHandlerInterface';
import {EventsEnum} from '../../../Events';
import {AgencyClientConsultantRoleAddedEventHandler} from '../event-handlers/AgencyClientConsultantRoleAddedEventHandler';

/**
 * Responsible for building different event handlers
 */
export class EventHandlerFactory {
  /**
   * Return event handler based on the event type
   */
  static getHandler(eventType: EventsEnum, logger: LoggerContext): EventHandlerInterface<BaseEventStoreDataInterface> {
    switch (eventType) {
      case EventsEnum.AGENCY_CONSULTANT_ROLE_ADDED:
        return new AgencyClientConsultantRoleAddedEventHandler(logger);
      default:
        logger.error('No configured handler found for this event', {eventType});
        throw new RuntimeError(`No configured handler found for this event: ${eventType}`);
    }
  }
}
