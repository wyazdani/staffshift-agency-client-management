import {BaseAggregateRecordInterface} from 'BaseAggregateRecordInterface';
import {ConsultantJobAssignAggregateStatusEnum} from './ConsultantJobAssignAggregateStatusEnum';

export interface ConsultantJobAssignAggregateRecordInterface extends BaseAggregateRecordInterface {
  status?: ConsultantJobAssignAggregateStatusEnum;
  progressed_client_ids?: string[];
}
