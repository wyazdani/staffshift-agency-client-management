import {BaseEventStoreDataInterface} from 'EventTypes';
import {BookingPreferenceAggregateIdInterface} from '../../aggregates/BookingPreference/types';
import {EventStorePubSubModelInterface} from 'ss-eventstore';

export interface AgencyClientRequiresPONumberSetEventStoreDataInterface extends BaseEventStoreDataInterface {
  _id: string;
  requires_po_number: boolean;
  client_id: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AgencyClientRequiresPONumberSetEventInterface
  extends EventStorePubSubModelInterface<
    AgencyClientRequiresPONumberSetEventStoreDataInterface,
    BookingPreferenceAggregateIdInterface
  > {}
