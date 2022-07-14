import {BaseEventStoreDataInterface} from 'EventTypes';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {PaymentTermAggregateIdInterface} from '../../aggregates/PaymentTerm/types';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AgencyClientCreditPaymentTermInheritedEventStoreDataInterface extends BaseEventStoreDataInterface {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AgencyClientCreditPaymentTermInheritedEventInterface
  extends EventStorePubSubModelInterface<
    AgencyClientCreditPaymentTermInheritedEventStoreDataInterface,
    PaymentTermAggregateIdInterface
  > {}
