import {BaseAggregateRecordInterface} from 'BaseAggregateRecordInterface';
import {ConsultantJobProcessAggregateStatusEnum} from './ConsultantJobProcessAggregateStatusEnum';
export interface ProgressedItemInterface {
  client_id: string;
  consultant_role_id?: string;
}
export interface ConsultantJobProcessAggregateRecordInterface extends BaseAggregateRecordInterface {
  status?: ConsultantJobProcessAggregateStatusEnum;
  progressed_items?: ProgressedItemInterface[];
}
