import {BaseEventStoreDataInterface} from 'EventTypes';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {PaymentTermAggregateIdInterface} from '../../aggregates/PaymentTerm/types';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AgencyClientPayInAdvancePaymentTermInheritedEventStoreDataInterface
  extends BaseEventStoreDataInterface {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AgencyClientPayInAdvancePaymentTermInheritedEventInterface
  extends EventStorePubSubModelInterface<
    AgencyClientPayInAdvancePaymentTermInheritedEventStoreDataInterface,
    PaymentTermAggregateIdInterface
  > {}
