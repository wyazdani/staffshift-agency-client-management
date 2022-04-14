import {BaseAggregateIdInterface} from 'BaseAggregateIdInterface';
import {AggregateIdType} from '../../../models/EventStore';

export interface ConsultantJobAssignAggregateIdInterface extends BaseAggregateIdInterface, AggregateIdType {
  name: 'consultant_job_assign';
  job_id: string;
}
