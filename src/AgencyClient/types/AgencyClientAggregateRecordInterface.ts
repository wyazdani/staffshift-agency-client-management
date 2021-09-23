import {AgencyClientConsultantInterface} from './AgencyClientConsultantInterface';

export interface AgencyClientAggregateRecordInterface {
  last_sequence_id: number;
  linked?: boolean;
  client_type?: string;
  consultants?: AgencyClientConsultantInterface[];
}
