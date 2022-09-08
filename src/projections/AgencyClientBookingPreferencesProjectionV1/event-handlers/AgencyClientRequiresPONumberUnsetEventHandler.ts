import {EventHandlerInterface} from 'EventHandlerInterface';
import {AgencyClientRequiresPONumberUnsetEventStoreDataInterface} from 'EventTypes/AgencyClientRequiresPONumberUnsetEventInterface';
import {AgencyClientBookingPreferencesProjection} from '../../../models/AgencyClientBookingPreferencesProjectionV1';
import {EventStoreModelInterface} from '../../../models/EventStore';

export class AgencyClientRequiresPONumberUnsetEventHandler
implements EventHandlerInterface<EventStoreModelInterface<AgencyClientRequiresPONumberUnsetEventStoreDataInterface>> {
  async handle(
    event: EventStoreModelInterface<AgencyClientRequiresPONumberUnsetEventStoreDataInterface>
  ): Promise<void> {
    await AgencyClientBookingPreferencesProjection.updateOne(
      {
        agency_id: event.aggregate_id.agency_id,
        client_id: event.aggregate_id.client_id
      },
      {
        $set: {
          requires_po_number: false
        }
      },
      {
        upsert: true
      }
    );
  }
}
