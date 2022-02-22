import {BaseAggregateIdInterface} from 'BaseAggregateIdInterface';
import {AggregateIdType} from '../../models/EventStore';

export interface ConsultantAggregateIdInterface
  extends BaseAggregateIdInterface,
    AggregateIdType {
  name: string;
}
