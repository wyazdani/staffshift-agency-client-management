import {BaseEventStoreDataInterface} from 'EventTypes';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {PaymentTermAggregateIdInterface} from '../../aggregates/PaymentTerm/types';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AgencyClientEmptyPaymentTermInheritedEventStoreDataInterface extends BaseEventStoreDataInterface {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AgencyClientEmptyPaymentTermInheritedEventInterface
  extends EventStorePubSubModelInterface<
    AgencyClientEmptyPaymentTermInheritedEventStoreDataInterface,
    PaymentTermAggregateIdInterface
  > {}
