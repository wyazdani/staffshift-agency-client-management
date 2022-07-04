import {LoggerContext} from 'a24-logzio-winston';
import {
  AgencyClientLinkedEventStoreDataInterface,
  AgencyClientSyncedEventStoreDataInterface,
  AgencyClientUnlinkedEventStoreDataInterface
} from 'EventTypes';
import {FilterQuery} from 'mongoose';
import {EventStorePubSubModelInterface, EventStoreProjectorInterface} from 'ss-eventstore';
import {EventsEnum} from '../../Events';
import {AgencyClientsProjectionV2DocumentType, AgencyClientsProjectionV2} from '../../models/AgencyClientsProjectionV2';
import {EventHandlerFactory} from './factories/EventHandlerFactory';

type SupportedEventsDataType =
  | AgencyClientLinkedEventStoreDataInterface
  | AgencyClientSyncedEventStoreDataInterface
  | AgencyClientUnlinkedEventStoreDataInterface;

const events = [EventsEnum.AGENCY_CLIENT_LINKED, EventsEnum.AGENCY_CLIENT_UNLINKED, EventsEnum.AGENCY_CLIENT_SYNCED];

export default class AgencyClientsProjector implements EventStoreProjectorInterface {
  async project(logger: LoggerContext, event: EventStorePubSubModelInterface): Promise<void> {
    const eventType: EventsEnum = event.type as EventsEnum;

    if (!events.includes(event.type as EventsEnum)) {
      logger.debug('Incoming event ignored', {event: event.type});

      return;
    }
    logger.debug('Processing the incoming event', {event});
    const eventHandler = EventHandlerFactory.getHandler(eventType, logger);

    await eventHandler.handle(event);
  }
}
