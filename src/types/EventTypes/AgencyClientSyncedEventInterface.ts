import {BaseEventStoreDataInterface} from 'EventTypes';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {AgencyClientAggregateIdInterface} from '../../aggregates/AgencyClient/types';

export interface AgencyClientSyncedEventStoreDataInterface extends BaseEventStoreDataInterface {
  client_type: string;
  linked: boolean;
  linked_at: Date;
  organisation_id?: string;
  site_id?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AgencyClientSyncedEventInterface
  extends EventStorePubSubModelInterface<AgencyClientSyncedEventStoreDataInterface, AgencyClientAggregateIdInterface> {}
