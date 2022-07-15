import {BaseAggregateRecordInterface} from 'BaseAggregateRecordInterface';
import {ClientInheritanceProcessAggregateStatusEnum} from './ClientInheritanceProcessAggregateStatusEnum';
export interface ProgressedItemInterface {
  client_id: string;
}
export interface ClientInheritanceProcessAggregateRecordInterface extends BaseAggregateRecordInterface {
  status?: ClientInheritanceProcessAggregateStatusEnum;
  progressed_items?: ProgressedItemInterface[];
}
