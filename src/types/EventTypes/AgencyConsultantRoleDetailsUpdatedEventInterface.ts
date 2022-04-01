import {BaseEventStoreDataInterface} from 'EventTypes/BaseEventStoreDataInterface';

export interface AgencyConsultantRoleDetailsUpdatedEventStoreDataInterface extends BaseEventStoreDataInterface {
  _id: string;
  name?: string;
  description?: string;
  max_consultants?: number;
}
