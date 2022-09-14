import {LoggerContext} from 'a24-logzio-winston';
import {EventListenerInterface, EventStorePubSubModelInterface} from 'ss-eventstore';
import {EventRepository} from '../../EventRepository';
import {EventsEnum} from '../../Events';
import {EventStore} from '../../models/EventStore';
import {EventHandlerFactory} from './factories/EventHandlerFactory';

const events = [
  EventsEnum.AGENCY_CLIENT_CONSULTANT_ASSIGNED,
  EventsEnum.AGENCY_CLIENT_CONSULTANT_UNASSIGNED,
  EventsEnum.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED
];

export default class AgencyClientConsultantsProjector implements EventListenerInterface {
  async onEvent(logger: LoggerContext, event: EventStorePubSubModelInterface): Promise<void> {
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
