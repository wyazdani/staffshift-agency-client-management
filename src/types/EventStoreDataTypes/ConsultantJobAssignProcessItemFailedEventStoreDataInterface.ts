import {BaseEventStoreDataInterface} from 'EventStoreDataTypes/BaseEventStoreDataInterface';

export interface ConsultantJobAssignProcessItemFailedEventStoreDataInterface extends BaseEventStoreDataInterface {
  client_id: string;
  error_code: string;
  error_message: string;
}
