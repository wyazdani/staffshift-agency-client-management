import {LoggerContext} from 'a24-logzio-winston';
import {RuntimeError} from 'a24-node-error-utils';
import {BaseEventStoreDataInterface} from 'EventTypes';
import {EventHandlerInterface} from 'EventHandlerInterface';
import {EventsEnum} from '../../Events';
import {
  AgencyClientBookingPasswordsUpdatedEventHandler,
  AgencyClientRequiresBookingPasswordSetEventHandler,
  AgencyClientRequiresBookingPasswordUnsetEventHandler,
  AgencyClientRequiresPONumberSetEventHandler,
  AgencyClientRequiresPONumberUnsetEventHandler,
  AgencyClientRequiresShiftRefNumberSetEventHandler,
  AgencyClientRequiresShiftRefNumberUnsetEventHandler,
  AgencyClientRequiresUniquePONumberSetEventHandler,
  AgencyClientRequiresUniquePONumberUnsetEventHandler
} from './event-handlers';

/**
 * Responsible for building different event handlers
 */
export class EventHandlerFactory {
  /**
   * Return event handler based on the event type
   */
  static getHandler(eventType: EventsEnum, logger: LoggerContext): EventHandlerInterface<BaseEventStoreDataInterface> {
    switch (eventType) {
      case EventsEnum.AGENCY_CLIENT_REQUIRES_PO_NUMBER_SET:
        return new AgencyClientRequiresPONumberSetEventHandler();
      case EventsEnum.AGENCY_CLIENT_REQUIRES_PO_NUMBER_UNSET:
        return new AgencyClientRequiresPONumberUnsetEventHandler();
      case EventsEnum.AGENCY_CLIENT_REQUIRES_UNIQUE_PO_NUMBER_SET:
        return new AgencyClientRequiresUniquePONumberSetEventHandler();
      case EventsEnum.AGENCY_CLIENT_REQUIRES_UNIQUE_PO_NUMBER_UNSET:
        return new AgencyClientRequiresUniquePONumberUnsetEventHandler();
      case EventsEnum.AGENCY_CLIENT_REQUIRES_BOOKING_PASSWORD_SET:
        return new AgencyClientRequiresBookingPasswordSetEventHandler();
      case EventsEnum.AGENCY_CLIENT_REQUIRES_BOOKING_PASSWORD_UNSET:
        return new AgencyClientRequiresBookingPasswordUnsetEventHandler();
      case EventsEnum.AGENCY_CLIENT_BOOKING_PASSWORDS_UPDATED:
        return new AgencyClientBookingPasswordsUpdatedEventHandler();
      case EventsEnum.AGENCY_CLIENT_REQUIRES_SHIFT_REF_NUMBER_SET:
        return new AgencyClientRequiresShiftRefNumberSetEventHandler();
      case EventsEnum.AGENCY_CLIENT_REQUIRES_SHIFT_REF_NUMBER_UNSET:
        return new AgencyClientRequiresShiftRefNumberUnsetEventHandler();
      default:
        logger.error('No configured handler found for this event', {eventType});
        throw new RuntimeError(`No configured handler found for this event: ${eventType}`);
    }
  }
}
