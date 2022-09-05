import {BaseEventStoreDataInterface} from 'EventTypes';
import {BookingPreferenceAggregateIdInterface} from '../../aggregates/BookingPreference/types';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AgencyClientRequiresBookingPasswordSetEventStoreDataInterface extends BaseEventStoreDataInterface {
  passwords: [];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AgencyClientRequiresBookingPasswordSetEventInterface
  extends EventStorePubSubModelInterface<
    AgencyClientRequiresBookingPasswordSetEventStoreDataInterface,
    BookingPreferenceAggregateIdInterface
  > {}
