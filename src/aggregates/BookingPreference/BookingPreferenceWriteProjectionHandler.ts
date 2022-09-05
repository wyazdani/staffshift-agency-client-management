import {AgencyClientBookingPasswordsUpdatedEventStoreDataInterface} from 'EventTypes/AgencyClientBookingPasswordsUpdatedEventInterface';
import {AgencyClientRequiresBookingPasswordSetEventStoreDataInterface} from 'EventTypes/AgencyClientRequiresBookingPasswordSetEventInterface';
import {WriteProjectionInterface} from 'WriteProjectionInterface';
import {EventsEnum} from '../../Events';
import {EventStoreModelInterface} from '../../models/EventStore';
import {BookingPreferenceAggregateRecordInterface} from './types';

/**
 * Responsible for handling all events to build the current state of the aggregate
 */
export class BookingPreferenceWriteProjectionHandler
implements WriteProjectionInterface<BookingPreferenceAggregateRecordInterface> {
  execute(
    type: EventsEnum,
    aggregate: BookingPreferenceAggregateRecordInterface,
    event: EventStoreModelInterface
  ): BookingPreferenceAggregateRecordInterface {
    switch (type) {
      case EventsEnum.AGENCY_CLIENT_REQUIRES_PO_NUMBER_SET:
        aggregate.requires_po_number = true;
        break;
      case EventsEnum.AGENCY_CLIENT_REQUIRES_PO_NUMBER_UNSET:
        aggregate.requires_po_number = false;
        aggregate.requires_unique_po_number = false;
        break;
      case EventsEnum.AGENCY_CLIENT_REQUIRES_UNIQUE_PO_NUMBER_SET:
        aggregate.requires_unique_po_number = true;
        break;
      case EventsEnum.AGENCY_CLIENT_REQUIRES_UNIQUE_PO_NUMBER_UNSET:
        aggregate.requires_unique_po_number = false;
        break;
      case EventsEnum.AGENCY_CLIENT_REQUIRES_BOOKING_PASSWORD_SET:
        aggregate.requires_booking_password = true;
        aggregate.booking_passwords = (
          event.data as AgencyClientRequiresBookingPasswordSetEventStoreDataInterface
        ).booking_passwords;
        break;
      case EventsEnum.AGENCY_CLIENT_REQUIRES_BOOKING_PASSWORD_UNSET:
        aggregate.requires_booking_password = false;
        aggregate.booking_passwords = [];
        break;
      case EventsEnum.AGENCY_CLIENT_BOOKING_PASSWORDS_UPDATED:
        aggregate.booking_passwords = (
          event.data as AgencyClientBookingPasswordsUpdatedEventStoreDataInterface
        ).booking_passwords;
        break;
      default:
        throw new Error(`Event type not supported: ${type}`);
    }
    return {...aggregate, last_sequence_id: event.sequence_id};
  }
}
