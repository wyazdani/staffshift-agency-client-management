import {BaseEventStoreDataInterface} from 'EventStoreDataTypes/BaseEventStoreDataInterface';
import {EventStoreEncodedErrorInterface} from 'EventStoreEncodedErrorInterface';

export interface ConsultantJobAssignProcessItemFailedEventStoreDataInterface extends BaseEventStoreDataInterface {
  client_id: string;
  errors: EventStoreEncodedErrorInterface[];
}
