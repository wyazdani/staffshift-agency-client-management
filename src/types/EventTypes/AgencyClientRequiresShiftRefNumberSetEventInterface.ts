import {BaseEventStoreDataInterface} from 'EventTypes';
import {BookingPreferenceAggregateIdInterface} from '../../aggregates/BookingPreference/types';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AgencyClientRequiresShiftRefNumberSetEventStoreDataInterface extends BaseEventStoreDataInterface {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AgencyClientRequiresShiftRefNumberSetEventInterface
  extends EventStorePubSubModelInterface<
    AgencyClientRequiresShiftRefNumberSetEventStoreDataInterface,
    BookingPreferenceAggregateIdInterface
  > {}
