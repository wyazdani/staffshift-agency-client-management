import {EventHandlerInterface} from 'EventHandlerInterface';
import {AgencyClientBookingPasswordsUpdatedEventStoreDataInterface} from 'EventTypes/AgencyClientBookingPasswordsUpdatedEventInterface';
import {AgencyClientBookingPreferencesProjection} from '../../../models/AgencyClientBookingPreferencesProjectionV1';
import {EventStoreModelInterface} from '../../../models/EventStore';

export class AgencyClientBookingPasswordsUpdatedEventHandler
implements
    EventHandlerInterface<EventStoreModelInterface<AgencyClientBookingPasswordsUpdatedEventStoreDataInterface>> {
  async handle(
    event: EventStoreModelInterface<AgencyClientBookingPasswordsUpdatedEventStoreDataInterface>
  ): Promise<void> {
    await AgencyClientBookingPreferencesProjection.updateOne(
      {
        agency_id: event.aggregate_id.agency_id,
        client_id: event.aggregate_id.client_id
      },
      {
        $set: {
          booking_passwords: event.aggregate_id.booking_passwords
        }
      },
      {
        upsert: true
      }
    );
  }
}
