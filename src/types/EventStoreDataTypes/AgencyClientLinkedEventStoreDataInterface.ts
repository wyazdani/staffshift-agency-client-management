import {BaseEventStoreDataInterface} from 'EventStoreDataTypes/BaseEventStoreDataInterface';

export interface AgencyClientLinkedEventStoreDataInterface extends BaseEventStoreDataInterface{
  client_type: string;
  organisation_id?: string;
  site_id?: string;
}