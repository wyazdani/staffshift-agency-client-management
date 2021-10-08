import {AgencyConsultantRoleInterface} from './AgencyConsultantRoleInterface';
import {BaseAggregateRecordInterface} from 'BaseAggregateRecordInterface';

export interface AgencyAggregateRecordInterface extends BaseAggregateRecordInterface {
  consultant_roles?: AgencyConsultantRoleInterface[];
}
