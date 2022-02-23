import {BaseEventStoreDataInterface} from 'EventStoreDataTypes/BaseEventStoreDataInterface';

export interface ConsultantAssignInitiatedEventStoreDataInterface extends BaseEventStoreDataInterface {
  _id: string;
  consultant_id: string;
  consultant_role_id: string;
  client_ids: string[];
}
