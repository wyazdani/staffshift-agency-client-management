import {EventStoreEncodedErrorInterface} from 'EventStoreEncodedErrorInterface';

export interface FailItemConsultantJobProcessCommandDataInterface {
  client_id: string;
  consultant_role_id?: string;
  errors: EventStoreEncodedErrorInterface[];
}
