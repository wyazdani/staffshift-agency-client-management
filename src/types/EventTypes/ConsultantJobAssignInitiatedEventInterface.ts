import {BaseEventStoreDataInterface} from 'EventTypes/BaseEventStoreDataInterface';

export interface ConsultantJobAssignInitiatedEventStoreDataInterface extends BaseEventStoreDataInterface {
  _id: string;
  consultant_id: string;
  consultant_role_id: string;
  client_ids: string[];
}
