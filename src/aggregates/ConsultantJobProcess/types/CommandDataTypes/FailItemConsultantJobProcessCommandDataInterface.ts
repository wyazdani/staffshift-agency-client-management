import {EventStoreEncodedErrorInterface} from 'EventStoreEncodedErrorInterface';

export interface FailItemConsultantJobProcessCommandDataInterface {
  client_id: string;
  errors: EventStoreEncodedErrorInterface[];
}
