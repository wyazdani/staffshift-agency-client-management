import {BaseEventStoreDataInterface} from 'EventTypes';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {AgencyClientAggregateIdInterface} from '../../aggregates/AgencyClient/types';

export interface AgencyClientLinkedEventStoreDataInterface extends BaseEventStoreDataInterface {
  client_type: string;
  organisation_id?: string;
  site_id?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AgencyClientLinkedEventInterface
  extends EventStorePubSubModelInterface<AgencyClientLinkedEventStoreDataInterface, AgencyClientAggregateIdInterface> {}
