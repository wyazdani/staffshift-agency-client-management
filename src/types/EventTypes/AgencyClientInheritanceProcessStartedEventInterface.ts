import {BaseEventStoreDataInterface} from 'EventTypes';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {ClientInheritanceProcessAggregateIdInterface} from '../../aggregates/ClientInheritanceProcess/types';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AgencyClientInheritanceProcessStartedEventStoreDataInterface extends BaseEventStoreDataInterface {
  /* number of estimated targets */
  estimated_count: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AgencyClientInheritanceProcessStartedEventInterface
  extends EventStorePubSubModelInterface<
    AgencyClientInheritanceProcessStartedEventStoreDataInterface,
    ClientInheritanceProcessAggregateIdInterface
  > {}
