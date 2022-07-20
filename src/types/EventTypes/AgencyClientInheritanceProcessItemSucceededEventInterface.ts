import {BaseEventStoreDataInterface} from 'EventTypes';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {ClientInheritanceProcessAggregateIdInterface} from '../../aggregates/ClientInheritanceProcess/types';

export interface AgencyClientInheritanceProcessItemSucceededEventStoreDataInterface
  extends BaseEventStoreDataInterface {
  client_id: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AgencyClientInheritanceProcessItemSucceededEventInterface
  extends EventStorePubSubModelInterface<
    AgencyClientInheritanceProcessItemSucceededEventStoreDataInterface,
    ClientInheritanceProcessAggregateIdInterface
  > {}
