import {BaseEventStoreDataInterface} from 'EventStoreDataTypes/BaseEventStoreDataInterface';

export interface AgencyConsultantRoleDetailsUpdatedEventStoreDataInterface extends BaseEventStoreDataInterface {
  _id: string;
  name?: string;
  description?: string;
  max_consultants?: number;
}
