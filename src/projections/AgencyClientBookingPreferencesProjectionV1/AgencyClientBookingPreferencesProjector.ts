import {LoggerContext} from 'a24-logzio-winston';
import {EventListenerInterface, EventStorePubSubModelInterface} from 'ss-eventstore';
import {EventsEnum} from '../../Events';
import {EventHandlerFactory} from './EventHandlerFactory';

const events = [
  EventsEnum.AGENCY_CLIENT_REQUIRES_PO_NUMBER_SET,
  EventsEnum.AGENCY_CLIENT_REQUIRES_PO_NUMBER_UNSET,
  EventsEnum.AGENCY_CLIENT_REQUIRES_UNIQUE_PO_NUMBER_SET,
  EventsEnum.AGENCY_CLIENT_REQUIRES_UNIQUE_PO_NUMBER_UNSET,
  EventsEnum.AGENCY_CLIENT_REQUIRES_BOOKING_PASSWORD_SET,
  EventsEnum.AGENCY_CLIENT_REQUIRES_BOOKING_PASSWORD_UNSET,
  EventsEnum.AGENCY_CLIENT_BOOKING_PASSWORDS_UPDATED,
  EventsEnum.AGENCY_CLIENT_REQUIRES_SHIFT_REF_NUMBER_SET,
  EventsEnum.AGENCY_CLIENT_REQUIRES_SHIFT_REF_NUMBER_UNSET
];

export default class AgencyClientBookingPreferencesProjector implements EventListenerInterface {
  async onEvent(logger: LoggerContext, event: EventStorePubSubModelInterface): Promise<void> {
    const eventType: EventsEnum = event.type as EventsEnum;

    if (!events.includes(eventType)) {
      logger.debug('Incoming event ignored', {eventType, event});
      return;
    }

    logger.debug('Processing the incoming event', {event});
    const eventHandler = EventHandlerFactory.getHandler(eventType, logger);

    await eventHandler.handle(event);
  }
}
