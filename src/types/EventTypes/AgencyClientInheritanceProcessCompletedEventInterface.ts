import {BaseEventStoreDataInterface} from 'EventTypes';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {ClientInheritanceProcessAggregateIdInterface} from '../../aggregates/ClientInheritanceProcess/types';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AgencyClientInheritanceProcessCompletedEventStoreDataInterface extends BaseEventStoreDataInterface {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AgencyClientInheritanceProcessCompletedEventInterface
  extends EventStorePubSubModelInterface<
    AgencyClientInheritanceProcessCompletedEventStoreDataInterface,
    ClientInheritanceProcessAggregateIdInterface
  > {}
