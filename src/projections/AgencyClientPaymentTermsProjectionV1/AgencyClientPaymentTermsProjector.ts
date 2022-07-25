import {LoggerContext} from 'a24-logzio-winston';
import {EventStoreProjectorInterface, EventStorePubSubModelInterface} from 'ss-eventstore';
import {EventRepository} from '../../EventRepository';
import {EventsEnum} from '../../Events';
import {EventStore} from '../../models/EventStore';
import {EventHandlerFactory} from './EventHandlerFactory';

const events = [
  EventsEnum.AGENCY_CLIENT_CREDIT_PAYMENT_TERM_APPLIED,
  EventsEnum.AGENCY_CLIENT_CREDIT_PAYMENT_TERM_INHERITED,
  EventsEnum.AGENCY_CLIENT_PAY_IN_ADVANCE_PAYMENT_TERM_APPLIED,
  EventsEnum.AGENCY_CLIENT_PAY_IN_ADVANCE_PAYMENT_TERM_INHERITED,
  EventsEnum.AGENCY_CLIENT_EMPTY_PAYMENT_TERM_INHERITED
];

export default class AgencyClientPaymentTermsProjector implements EventStoreProjectorInterface {
  async project(logger: LoggerContext, event: EventStorePubSubModelInterface): Promise<void> {
    const eventType: EventsEnum = event.type as EventsEnum;

    if (!events.includes(eventType)) {
      logger.debug('Incoming event ignored', {eventType, event});
      return;
    }
    const eventRepository = new EventRepository(EventStore, logger.requestId);

    logger.debug('Processing the incoming event', {event});
    const eventHandler = EventHandlerFactory.getHandler(eventType, eventRepository, logger);

    await eventHandler.handle(event);
  }
}
