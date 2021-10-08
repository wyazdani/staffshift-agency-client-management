import {AgencyConsultantRoleInterface} from './AgencyConsultantRoleInterface';
export interface BaseAggregateRecordInterface {
  last_sequence_id: number;
}
export interface AgencyAggregateRecordInterface extends BaseAggregateRecordInterface{
  consultant_roles?: AgencyConsultantRoleInterface[];
}
