import {LoggerContext} from 'a24-logzio-winston';
import {RuntimeError} from 'a24-node-error-utils';
import {BaseEventStoreDataInterface} from 'EventTypes';
import {EventHandlerInterface} from 'EventHandlerInterface';
import {EventsEnum} from '../../../Events';
import {AgencyClientLinkedEventHandler} from '../event-handlers/AgencyClientLinkedEventHandler';
import {AgencyClientUnLinkedEventHandler} from '../event-handlers/AgencyClientUnLinkedEventHandler';
import {AgencyClientSyncedEventHandler} from '../event-handlers/AgencyClientSyncedEventHandler';

/**
 * Responsible for building different event handlers
 */
export class EventHandlerFactory {
  /**
   * Return event handler based on the event type
   */
  static getHandler(eventType: EventsEnum, logger: LoggerContext): EventHandlerInterface<BaseEventStoreDataInterface> {
    switch (eventType) {
      case EventsEnum.AGENCY_CLIENT_LINKED:
        return new AgencyClientLinkedEventHandler(logger);
      case EventsEnum.AGENCY_CLIENT_UNLINKED:
        return new AgencyClientUnLinkedEventHandler(logger);
      case EventsEnum.AGENCY_CLIENT_SYNCED:
        return new AgencyClientSyncedEventHandler(logger);
      default:
        logger.error('No configured handler found for this event', {eventType});
        throw new RuntimeError(`No configured handler found for this event: ${eventType}`);
    }
  }
}
