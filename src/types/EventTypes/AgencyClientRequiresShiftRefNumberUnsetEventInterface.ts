import {BaseEventStoreDataInterface} from 'EventTypes';
import {BookingPreferenceAggregateIdInterface} from '../../aggregates/BookingPreference/types';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AgencyClientRequiresShiftRefNumberUnsetEventStoreDataInterface extends BaseEventStoreDataInterface {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AgencyClientRequiresShiftRefNumberUnsetEventInterface
  extends EventStorePubSubModelInterface<
    AgencyClientRequiresShiftRefNumberUnsetEventStoreDataInterface,
    BookingPreferenceAggregateIdInterface
  > {}
