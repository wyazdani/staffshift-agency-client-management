import {BaseAggregateIdInterface} from 'BaseAggregateIdInterface';
import {AggregateIdType} from '../../../models/EventStore';

export interface ConsultantJobAssignAggregateIdInterface extends BaseAggregateIdInterface, AggregateIdType {
  name: string;
  job_id: string;
}
