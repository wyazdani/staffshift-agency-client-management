import {EventStoreEncodedErrorInterface} from 'EventStoreEncodedErrorInterface';

export interface FailItemConsultantJobAssignCommandDataInterface {
  client_id: string;
  errors: EventStoreEncodedErrorInterface[];
}
