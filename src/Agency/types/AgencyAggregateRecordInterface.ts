import {AgencyConsultantRoleInterface} from './AgencyConsultantRoleInterface';

export interface AgencyAggregateRecordInterface {
  consultant_roles?: AgencyConsultantRoleInterface[];
  last_sequence_id: number;
}
