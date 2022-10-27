import {EventHandlerInterface} from 'EventHandlerInterface';
import {AgencyClientRequiresShiftRefNumberUnsetEventStoreDataInterface} from 'EventTypes/AgencyClientRequiresShiftRefNumberUnsetEventInterface';
import {AgencyClientBookingPreferencesProjection} from '../../../models/AgencyClientBookingPreferencesProjectionV1';
import {EventStoreModelInterface} from '../../../models/EventStore';

export class AgencyClientRequiresShiftRefNumberUnsetEventHandler
implements
    EventHandlerInterface<EventStoreModelInterface<AgencyClientRequiresShiftRefNumberUnsetEventStoreDataInterface>> {
  async handle(
    event: EventStoreModelInterface<AgencyClientRequiresShiftRefNumberUnsetEventStoreDataInterface>
  ): Promise<void> {
    await AgencyClientBookingPreferencesProjection.updateOne(
      {
        agency_id: event.aggregate_id.agency_id,
        client_id: event.aggregate_id.client_id
      },
      {
        $set: {
          requires_shift_ref_number: false,
          _etags: {
            [event.aggregate_id.name]: event.sequence_id
          }
        }
      },
      {
        upsert: true
      }
    );
  }
}
