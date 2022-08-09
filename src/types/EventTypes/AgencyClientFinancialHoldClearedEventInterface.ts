import {BaseEventStoreDataInterface} from 'EventTypes';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {FinancialHoldAggregateIdInterface} from '../../aggregates/FinancialHold/types';

export interface AgencyClientFinancialHoldClearedEventStoreDataInterface extends BaseEventStoreDataInterface {
  note: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AgencyClientFinancialHoldClearedEventInterface
  extends EventStorePubSubModelInterface<
    AgencyClientFinancialHoldClearedEventStoreDataInterface,
    FinancialHoldAggregateIdInterface
  > {}
