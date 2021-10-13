import {BaseEventStoreDataInterface} from 'EventStoreDataTypes/BaseEventStoreDataInterface';

export interface AgencyConsultantRoleAddedEventStoreDataInterface extends BaseEventStoreDataInterface {
  _id: string;
  name: string;
  description: string;
  max_consultants: number;
}
