import {BaseAggregateIdInterface} from 'BaseAggregateIdInterface';
import {AggregateIdType} from '../../models/EventStore';

export interface ConsultantJobAggregateIdInterface extends BaseAggregateIdInterface, AggregateIdType {
  name: string;
}
