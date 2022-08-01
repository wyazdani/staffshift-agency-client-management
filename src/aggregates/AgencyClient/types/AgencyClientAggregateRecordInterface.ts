import {AgencyClientConsultantInterface} from './AgencyClientConsultantInterface';
import {BaseAggregateRecordInterface} from 'BaseAggregateRecordInterface';

export interface AgencyClientAggregateRecordInterface extends BaseAggregateRecordInterface {
  linked?: boolean;
  client_type?: string;
  consultants?: AgencyClientConsultantInterface[];
  parent_id?: string;
  last_linked_date?: Date;
}
