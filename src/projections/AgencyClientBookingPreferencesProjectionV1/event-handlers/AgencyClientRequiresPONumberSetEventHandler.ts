import {EventHandlerInterface} from 'EventHandlerInterface';
import {AgencyClientRequiresPONumberSetEventStoreDataInterface} from 'EventTypes/AgencyClientRequiresPONumberSetEventInterface';
import {AgencyClientBookingPreferencesProjection} from '../../../models/AgencyClientBookingPreferencesProjectionV1';
import {EventStoreModelInterface} from '../../../models/EventStore';

export class AgencyClientRequiresPONumberSetEventHandler
implements EventHandlerInterface<EventStoreModelInterface<AgencyClientRequiresPONumberSetEventStoreDataInterface>> {
  async handle(event: EventStoreModelInterface<AgencyClientRequiresPONumberSetEventStoreDataInterface>): Promise<void> {
    await AgencyClientBookingPreferencesProjection.updateOne(
      {
        agency_id: event.aggregate_id.agency_id,
        client_id: event.aggregate_id.client_id
      },
      {
        $set: {
          requires_po_number: true
        }
      },
      {
        upsert: true
      }
    );
  }
}
