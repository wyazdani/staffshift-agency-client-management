import {BaseAggregateRecordInterface} from 'BaseAggregateRecordInterface';
import {ConsultantJobProcessAggregateStatusEnum} from './ConsultantJobProcessAggregateStatusEnum';

export interface ConsultantJobProcessAggregateRecordInterface extends BaseAggregateRecordInterface {
  status?: ConsultantJobProcessAggregateStatusEnum;
  progressed_client_ids?: string[];
}
