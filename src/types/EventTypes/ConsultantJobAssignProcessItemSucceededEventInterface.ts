import {BaseEventStoreDataInterface} from 'EventTypes/BaseEventStoreDataInterface';

export interface ConsultantJobAssignProcessItemSucceededEventStoreDataInterface extends BaseEventStoreDataInterface {
  client_id: string;
}
