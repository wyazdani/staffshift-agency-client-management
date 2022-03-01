import {BaseAggregateRecordInterface} from 'BaseAggregateRecordInterface';

export interface ConsultantJobAssignAggregateRecordErrorInterface {
  consultant_id: string;
  consultant_role_id: string;
  reason: string;
  actioned_at: string;
}

export interface ConsultantJobAssignAggregateRecordInterface extends BaseAggregateRecordInterface {
  errors?: ConsultantJobAssignAggregateRecordErrorInterface[];
}
