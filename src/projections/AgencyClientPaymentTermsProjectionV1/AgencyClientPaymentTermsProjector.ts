import {LoggerContext} from 'a24-logzio-winston';
import {EventListenerInterface, EventStorePubSubModelInterface} from 'ss-eventstore';
import {EventsEnum} from '../../Events';
import {EventHandlerFactory} from './EventHandlerFactory';

const events = [
  EventsEnum.AGENCY_CLIENT_CREDIT_PAYMENT_TERM_APPLIED,
  EventsEnum.AGENCY_CLIENT_CREDIT_PAYMENT_TERM_INHERITED,
  EventsEnum.AGENCY_CLIENT_PAY_IN_ADVANCE_PAYMENT_TERM_APPLIED,
  EventsEnum.AGENCY_CLIENT_PAY_IN_ADVANCE_PAYMENT_TERM_INHERITED,
  EventsEnum.AGENCY_CLIENT_EMPTY_PAYMENT_TERM_INHERITED
];

export default class AgencyClientPaymentTermsProjector implements EventListenerInterface {
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
