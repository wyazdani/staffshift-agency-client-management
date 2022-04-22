import {BaseAggregateIdInterface} from 'BaseAggregateIdInterface';
import {AggregateIdType} from '../../../models/EventStore';

export interface ConsultantJobProcessAggregateIdInterface extends BaseAggregateIdInterface, AggregateIdType {
  name: 'consultant_job_process';
  job_id: string;
}
