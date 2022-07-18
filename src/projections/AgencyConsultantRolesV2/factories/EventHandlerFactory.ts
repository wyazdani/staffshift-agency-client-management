import {LoggerContext} from 'a24-logzio-winston';
import {RuntimeError} from 'a24-node-error-utils';
import {BaseEventStoreDataInterface} from 'EventTypes';
import {EventHandlerInterface} from 'EventHandlerInterface';
import {EventsEnum} from '../../../Events';
import {AgencyConsultantRoleAddedEventHandler} from '../event-handlers/AgencyConsultantRoleAddedEventHandler';
import {EventStorePubSubModelInterface} from 'ss-eventstore/dist/declarations';
import {AgencyConsultantRoleDetailsUpdatedEventHandler} from '../event-handlers/AgencyConsultantRoleDetailsUpdatedEventHandler';
import {AgencyConsultantRoleEnabledEventHandler} from '../event-handlers/AgencyConsultantRoleEnabledEventHandler';
import {AgencyConsultantRoleDisabledEventHandler} from '../event-handlers/AgencyConsultantRoleDisabledEventHandler';

/**
 * Responsible for building different event handlers
 */
export class EventHandlerFactory {
  /**
   * Return event handler based on the event type
   */
  static getHandler(eventType: EventsEnum, logger: LoggerContext): EventHandlerInterface<BaseEventStoreDataInterface> {
    logger.debug('Processing the incoming event', {event: eventType});

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
