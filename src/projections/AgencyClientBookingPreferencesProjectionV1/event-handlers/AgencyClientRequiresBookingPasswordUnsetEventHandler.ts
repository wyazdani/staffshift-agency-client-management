import {EventHandlerInterface} from 'EventHandlerInterface';
import {AgencyClientRequiresBookingPasswordUnsetEventStoreDataInterface} from 'EventTypes/AgencyClientRequiresBookingPasswordUnsetEventInterface';
import {AgencyClientBookingPreferencesProjection} from '../../../models/AgencyClientBookingPreferencesProjectionV1';
import {EventStoreModelInterface} from '../../../models/EventStore';

export class AgencyClientRequiresBookingPasswordUnsetEventHandler
implements
    EventHandlerInterface<EventStoreModelInterface<AgencyClientRequiresBookingPasswordUnsetEventStoreDataInterface>> {
  async handle(
    event: EventStoreModelInterface<AgencyClientRequiresBookingPasswordUnsetEventStoreDataInterface>
  ): Promise<void> {
    await AgencyClientBookingPreferencesProjection.updateOne(
      {
        agency_id: event.aggregate_id.agency_id,
        client_id: event.aggregate_id.client_id
      },
      {
        $set: {
          requires_booking_password: false,
          booking_passwords: [],
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
