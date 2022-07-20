import {BaseEventStoreDataInterface} from 'EventTypes';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {ClientInheritanceProcessAggregateIdInterface} from '../../aggregates/ClientInheritanceProcess/types';
import {EventStoreEncodedErrorInterface} from 'EventStoreEncodedErrorInterface';

export interface AgencyClientInheritanceProcessItemFailedEventStoreDataInterface extends BaseEventStoreDataInterface {
  client_id: string;
  errors: EventStoreEncodedErrorInterface[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AgencyClientInheritanceProcessItemFailedEventInterface
  extends EventStorePubSubModelInterface<
    AgencyClientInheritanceProcessItemFailedEventStoreDataInterface,
    ClientInheritanceProcessAggregateIdInterface
  > {}
