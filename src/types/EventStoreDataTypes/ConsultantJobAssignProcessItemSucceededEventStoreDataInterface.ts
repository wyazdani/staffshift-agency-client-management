import {BaseEventStoreDataInterface} from 'EventStoreDataTypes/BaseEventStoreDataInterface';

export interface ConsultantJobAssignProcessItemSucceededEventStoreDataInterface extends BaseEventStoreDataInterface {
  client_id: string;
}
