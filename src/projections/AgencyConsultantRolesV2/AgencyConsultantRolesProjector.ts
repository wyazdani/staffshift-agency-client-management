import {LoggerContext} from 'a24-logzio-winston';
import {EventStoreListenerInterface, EventStorePubSubModelInterface} from 'ss-eventstore';
import {EventsEnum} from '../../Events';
import {EventHandlerFactory} from './factories/EventHandlerFactory';

const events = [
  EventsEnum.AGENCY_CONSULTANT_ROLE_ADDED,
  EventsEnum.AGENCY_CONSULTANT_ROLE_ENABLED,
  EventsEnum.AGENCY_CONSULTANT_ROLE_DISABLED,
  EventsEnum.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED
];

/**
 * Projects to AgencyConsultantRoles
 */
export default class AgencyConsultantRolesProjector implements EventStoreListenerInterface {
  async onEvent(logger: LoggerContext, event: EventStorePubSubModelInterface): Promise<void> {
    if (!events.includes(event.type as EventsEnum)) {
      logger.debug('Incoming event ignored', {event: event.type});
      return;
    }

    const eventType: EventsEnum = event.type as EventsEnum;
    const eventHandler = EventHandlerFactory.getHandler(eventType, logger);

    await eventHandler.handle(event);
  }
}
