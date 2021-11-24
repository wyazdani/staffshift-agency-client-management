import {BaseEventStoreDataInterface} from 'EventStoreDataTypes/BaseEventStoreDataInterface';

export interface AgencyClientConsultantUnassignedEventStoreDataInterface extends BaseEventStoreDataInterface {
  _id: string;
  client_type: string;
  organisation_id?: string;
  site_id?: string;
}
