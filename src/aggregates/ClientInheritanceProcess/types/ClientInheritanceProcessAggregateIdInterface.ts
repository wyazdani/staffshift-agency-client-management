import {BaseAggregateIdInterface} from 'BaseAggregateIdInterface';
import {AggregateIdType} from '../../../models/EventStore';

export interface ClientInheritanceProcessAggregateIdInterface extends BaseAggregateIdInterface, AggregateIdType {
  name: 'client_inheritance_process';
  job_id: string;
}
