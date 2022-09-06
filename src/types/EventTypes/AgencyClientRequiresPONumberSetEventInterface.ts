import {BaseEventStoreDataInterface} from 'EventTypes';
import {BookingPreferenceAggregateIdInterface} from '../../aggregates/BookingPreference/types';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AgencyClientRequiresPONumberSetEventStoreDataInterface extends BaseEventStoreDataInterface {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AgencyClientRequiresPONumberSetEventInterface
  extends EventStorePubSubModelInterface<
    AgencyClientRequiresPONumberSetEventStoreDataInterface,
    BookingPreferenceAggregateIdInterface
  > {}
