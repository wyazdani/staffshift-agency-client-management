import {LoggerContext} from 'a24-logzio-winston';
import {
  AgencyClientLinkedEventStoreDataInterface,
  AgencyClientSyncedEventStoreDataInterface,
  AgencyClientUnlinkedEventStoreDataInterface
} from 'EventStoreDataTypes';
import {FilterQuery} from 'mongoose';
import {EventStorePubSubModelInterface, EventStoreProjectorInterface} from 'ss-eventstore';
import {EventsEnum} from '../../Events';
import {AgencyClientsProjectionV2DocumentType, AgencyClientsProjectionV2} from '../../models/AgencyClientsProjectionV2';

type SupportedEventsDataType =
  | AgencyClientLinkedEventStoreDataInterface
  | AgencyClientSyncedEventStoreDataInterface
  | AgencyClientUnlinkedEventStoreDataInterface;

const events = [EventsEnum.AGENCY_CLIENT_LINKED, EventsEnum.AGENCY_CLIENT_UNLINKED, EventsEnum.AGENCY_CLIENT_SYNCED];

export default class AgencyClientsProjector implements EventStoreProjectorInterface {
  async project(logger: LoggerContext, event: EventStorePubSubModelInterface): Promise<void> {
    if (!events.includes(event.type as EventsEnum)) {
      logger.debug('Incoming event ignored', {event: event.type});

      return;
    }
    const criteria: FilterQuery<AgencyClientsProjectionV2DocumentType> = {
      agency_id: event.aggregate_id.agency_id as string,
      client_id: event.aggregate_id.client_id as string
    };

    const eventData = event.data as SupportedEventsDataType;

    if (eventData.organisation_id) {
      criteria.organisation_id = eventData.organisation_id;
    }
    if (eventData.site_id) {
      criteria.site_id = eventData.site_id;
    }
    if (EventsEnum.AGENCY_CLIENT_LINKED === event.type) {
      await AgencyClientsProjectionV2.findOneAndUpdate(
        criteria,
        {
          client_type: eventData.client_type,
          linked: true
        },
        {upsert: true}
      );
    } else if (EventsEnum.AGENCY_CLIENT_UNLINKED === event.type) {
      await AgencyClientsProjectionV2.findOneAndUpdate(
        criteria,
        {
          client_type: eventData.client_type,
          linked: false
        },
        {upsert: true}
      );
    } else if (EventsEnum.AGENCY_CLIENT_SYNCED === event.type) {
      await AgencyClientsProjectionV2.findOneAndUpdate(
        criteria,
        {
          client_type: eventData.client_type,
          linked: (event.data as AgencyClientSyncedEventStoreDataInterface).linked
        },
        {upsert: true}
      );
    }
  }
}
