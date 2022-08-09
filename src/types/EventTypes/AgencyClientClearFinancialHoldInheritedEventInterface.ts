import {BaseEventStoreDataInterface} from 'EventTypes';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {FinancialHoldAggregateIdInterface} from '../../aggregates/FinancialHold/types';

export interface AgencyClientClearFinancialHoldInheritedEventStoreDataInterface extends BaseEventStoreDataInterface {
  note: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AgencyClientClearFinancialHoldInheritedEventInterface
  extends EventStorePubSubModelInterface<
    AgencyClientClearFinancialHoldInheritedEventStoreDataInterface,
    FinancialHoldAggregateIdInterface
  > {}
