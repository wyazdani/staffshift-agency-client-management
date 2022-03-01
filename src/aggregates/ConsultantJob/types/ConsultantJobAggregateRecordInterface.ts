import {BaseAggregateRecordInterface} from 'BaseAggregateRecordInterface';

export interface ConsultantJobAggregateRecordProcessInterface {
  _id: string;
  consultants: string[];
  status: 'initiated' | 'completed';
}

export interface ConsultantJobAggregateRecordInterface extends BaseAggregateRecordInterface {
  processes?: ConsultantJobAggregateRecordProcessInterface[];
}
