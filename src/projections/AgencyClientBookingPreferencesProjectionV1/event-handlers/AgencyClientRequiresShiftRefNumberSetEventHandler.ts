import {EventHandlerInterface} from 'EventHandlerInterface';
import {AgencyClientRequiresShiftRefNumberSetEventStoreDataInterface} from 'EventTypes/AgencyClientRequiresShiftRefNumberSetEventInterface';
import {AgencyClientBookingPreferencesProjection} from '../../../models/AgencyClientBookingPreferencesProjectionV1';
import {EventStoreModelInterface} from '../../../models/EventStore';

export class AgencyClientRequiresShiftRefNumberSetEventHandler
implements
    EventHandlerInterface<EventStoreModelInterface<AgencyClientRequiresShiftRefNumberSetEventStoreDataInterface>> {
  async handle(
    event: EventStoreModelInterface<AgencyClientRequiresShiftRefNumberSetEventStoreDataInterface>
  ): Promise<void> {
    await AgencyClientBookingPreferencesProjection.updateOne(
      {
        agency_id: event.aggregate_id.agency_id,
        client_id: event.aggregate_id.client_id
      },
      {
        $set: {
          requires_shift_ref_number: true
        }
      },
      {
        upsert: true
      }
    );
  }
}
