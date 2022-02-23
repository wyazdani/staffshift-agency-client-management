import {BaseAggregateRecordInterface} from 'BaseAggregateRecordInterface';

export interface ConsultantAggregateRecordProcessInterface {
  _id: string;
  consultants: string[];
  status: 'initiated' | 'completed';
}

export interface ConsultantAggregateRecordInterface extends BaseAggregateRecordInterface {
  processes?: ConsultantAggregateRecordProcessInterface[];
}
