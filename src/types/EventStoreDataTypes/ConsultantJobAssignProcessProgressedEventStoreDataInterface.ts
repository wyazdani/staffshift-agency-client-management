import {BaseEventStoreDataInterface} from 'EventStoreDataTypes/BaseEventStoreDataInterface';

export interface ConsultantJobAssignProcessProgressedEventStoreDataInterface extends BaseEventStoreDataInterface {
  count: number;
  client_ids: string[];
}
