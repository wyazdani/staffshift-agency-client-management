import {BaseEventStoreDataInterface} from 'EventStoreDataTypes/BaseEventStoreDataInterface';

export interface AgencyClientConsultantAssignedEventStoreDataInterface extends BaseEventStoreDataInterface {
  _id: string;
  consultant_role_id: string;
  consultant_id: string;
  client_type: string;
  organisation_id?: string;
  site_id?: string;
}
