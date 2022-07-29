import {LoggerContext} from 'a24-logzio-winston';
import {EventStoreProjectorInterface, EventStorePubSubModelInterface} from 'ss-eventstore';
import {EventRepository} from '../../EventRepository';
import {EventsEnum} from '../../Events';
import {EventStore} from '../../models/EventStore';
import {EventHandlerFactory} from './EventHandlerFactory';

const events = [EventsEnum.AGENCY_CLIENT_LINKED, EventsEnum.AGENCY_CLIENT_SYNCED];

export class PaymentTermAgencyClientLinkedListener implements EventStoreProjectorInterface {
  async project(logger: LoggerContext, event: EventStorePubSubModelInterface): Promise<void> {
    const eventType: EventsEnum = event.type as EventsEnum;

    if (!events.includes(eventType)) {
      logger.debug('Incoming event ignored', {eventType, event});
      return;
    }
    const eventRepository = new EventRepository(EventStore, logger.requestId);

    logger.debug('Processing the incoming event', {event});

    const handler = EventHandlerFactory.getHandler(eventType, logger, eventRepository);

    await handler.handle(event);
  }
}
