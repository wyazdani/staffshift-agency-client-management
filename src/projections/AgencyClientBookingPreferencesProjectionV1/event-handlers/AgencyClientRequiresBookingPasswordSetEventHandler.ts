import {EventHandlerInterface} from 'EventHandlerInterface';
import {AgencyClientRequiresBookingPasswordSetEventStoreDataInterface} from 'EventTypes/AgencyClientRequiresBookingPasswordSetEventInterface';
import {AgencyClientBookingPreferencesProjection} from '../../../models/AgencyClientBookingPreferencesProjectionV1';
import {EventStoreModelInterface} from '../../../models/EventStore';

export class AgencyClientRequiresBookingPasswordSetEventHandler
implements
    EventHandlerInterface<EventStoreModelInterface<AgencyClientRequiresBookingPasswordSetEventStoreDataInterface>> {
  async handle(
    event: EventStoreModelInterface<AgencyClientRequiresBookingPasswordSetEventStoreDataInterface>
  ): Promise<void> {
    await AgencyClientBookingPreferencesProjection.updateOne(
      {
        agency_id: event.aggregate_id.agency_id,
        client_id: event.aggregate_id.client_id
      },
      {
        $set: {
          requires_booking_password: true,
          booking_passwords: event.aggregate_id.booking_passwords
        }
      },
      {
        upsert: true
      }
    );
  }
}
