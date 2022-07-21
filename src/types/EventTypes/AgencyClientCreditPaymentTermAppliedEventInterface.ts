import {BaseEventStoreDataInterface} from 'EventTypes';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {PaymentTermAggregateIdInterface} from '../../aggregates/PaymentTerm/types';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AgencyClientCreditPaymentTermAppliedEventStoreDataInterface extends BaseEventStoreDataInterface {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AgencyClientCreditPaymentTermAppliedEventInterface
  extends EventStorePubSubModelInterface<
    AgencyClientCreditPaymentTermAppliedEventStoreDataInterface,
    PaymentTermAggregateIdInterface
  > {}
