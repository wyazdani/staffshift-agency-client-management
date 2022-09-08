import {EventHandlerInterface} from 'EventHandlerInterface';
import {AgencyClientRequiresUniquePONumberSetEventStoreDataInterface} from 'EventTypes/AgencyClientRequiresUniquePONumberSetEventInterface';
import {AgencyClientBookingPreferencesProjection} from '../../../models/AgencyClientBookingPreferencesProjectionV1';
import {EventStoreModelInterface} from '../../../models/EventStore';

export class AgencyClientRequiresUniquePONumberSetEventHandler
implements
    EventHandlerInterface<EventStoreModelInterface<AgencyClientRequiresUniquePONumberSetEventStoreDataInterface>> {
  async handle(
    event: EventStoreModelInterface<AgencyClientRequiresUniquePONumberSetEventStoreDataInterface>
  ): Promise<void> {
    await AgencyClientBookingPreferencesProjection.updateOne(
      {
        agency_id: event.aggregate_id.agency_id,
        client_id: event.aggregate_id.client_id
      },
      {
        $set: {
          requires_unique_po_number: true
        }
      },
      {
        upsert: true
      }
    );
  }
}
