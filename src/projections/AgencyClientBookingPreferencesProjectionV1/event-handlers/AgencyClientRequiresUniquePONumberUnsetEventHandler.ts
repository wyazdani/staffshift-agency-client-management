import {EventHandlerInterface} from 'EventHandlerInterface';
import {AgencyClientRequiresUniquePONumberUnsetEventStoreDataInterface} from 'EventTypes/AgencyClientRequiresUniquePONumberUnsetEventInterface';
import {AgencyClientBookingPreferencesProjection} from '../../../models/AgencyClientBookingPreferencesProjectionV1';
import {EventStoreModelInterface} from '../../../models/EventStore';

export class AgencyClientRequiresUniquePONumberUnsetEventHandler
implements
    EventHandlerInterface<EventStoreModelInterface<AgencyClientRequiresUniquePONumberUnsetEventStoreDataInterface>> {
  async handle(
    event: EventStoreModelInterface<AgencyClientRequiresUniquePONumberUnsetEventStoreDataInterface>
  ): Promise<void> {
    await AgencyClientBookingPreferencesProjection.updateOne(
      {
        agency_id: event.aggregate_id.agency_id,
        client_id: event.aggregate_id.client_id
      },
      {
        $set: {
          requires_unique_po_number: false
        }
      },
      {
        upsert: true
      }
    );
  }
}
