import {BaseEventStoreDataInterface} from 'EventTypes/BaseEventStoreDataInterface';

export interface AgencyClientSyncedEventStoreDataInterface extends BaseEventStoreDataInterface {
  client_type: string;
  linked: boolean;
  linked_at: Date;
  organisation_id?: string;
  site_id?: string;
}
