import {BaseAggregateIdInterface} from 'BaseAggregateIdInterface';
import {AggregateIdType} from '../../../models/EventStore';

export interface AgencyAggregateIdInterface extends AggregateIdType {
  agency_id: string;
}
