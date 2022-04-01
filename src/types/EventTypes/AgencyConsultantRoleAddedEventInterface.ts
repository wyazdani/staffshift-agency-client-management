import {BaseEventStoreDataInterface} from 'EventTypes/BaseEventStoreDataInterface';

export interface AgencyConsultantRoleAddedEventStoreDataInterface extends BaseEventStoreDataInterface {
  _id: string;
  name: string;
  description: string;
  max_consultants: number;
}
