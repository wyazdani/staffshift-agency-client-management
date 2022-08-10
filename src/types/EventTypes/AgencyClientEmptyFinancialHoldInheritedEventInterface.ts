import {BaseEventStoreDataInterface} from 'EventTypes';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {FinancialHoldAggregateIdInterface} from '../../aggregates/FinancialHold/types';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AgencyClientEmptyFinancialHoldInheritedEventStoreDataInterface extends BaseEventStoreDataInterface {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AgencyClientEmptyFinancialHoldInheritedEventInterface
  extends EventStorePubSubModelInterface<
    AgencyClientEmptyFinancialHoldInheritedEventStoreDataInterface,
    FinancialHoldAggregateIdInterface
  > {}
