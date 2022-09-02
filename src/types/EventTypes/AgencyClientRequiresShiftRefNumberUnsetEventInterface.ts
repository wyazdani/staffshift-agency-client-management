import {BaseEventStoreDataInterface} from 'EventTypes';
import {BookingPreferenceAggregateIdInterface} from '../../aggregates/BookingPreference/types';
import {EventStorePubSubModelInterface} from 'ss-eventstore';

export interface AgencyClientRequiresShiftRefNumberUnsetEventStoreDataInterface extends BaseEventStoreDataInterface {
  _id: string;
  requires_shift_ref_number: boolean;
  client_id: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AgencyClientRequiresShiftRefNumberUnsetEventInterface
  extends EventStorePubSubModelInterface<
    AgencyClientRequiresShiftRefNumberUnsetEventStoreDataInterface,
    BookingPreferenceAggregateIdInterface
  > {}
