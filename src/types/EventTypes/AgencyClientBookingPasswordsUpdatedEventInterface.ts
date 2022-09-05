import {BaseEventStoreDataInterface} from 'EventTypes';
import {BookingPreferenceAggregateIdInterface} from '../../aggregates/BookingPreference/types';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AgencyClientBookingPasswordsUpdatedEventStoreDataInterface extends BaseEventStoreDataInterface {
  passwords: [];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AgencyClientBookingPasswordsUpdatedEventInterface
  extends EventStorePubSubModelInterface<
    AgencyClientBookingPasswordsUpdatedEventStoreDataInterface,
    BookingPreferenceAggregateIdInterface
  > {}
