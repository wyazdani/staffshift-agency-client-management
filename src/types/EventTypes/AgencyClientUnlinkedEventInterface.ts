import {BaseEventStoreDataInterface} from 'EventTypes/BaseEventStoreDataInterface';

export interface AgencyClientUnlinkedEventStoreDataInterface extends BaseEventStoreDataInterface {
  client_type: string;
  organisation_id?: string;
  site_id?: string;
}
