import {BaseAggregateIdInterface} from 'BaseAggregateIdInterface';
import {AggregateIdType} from '../../../models/EventStore';

export interface AgencyAggregateIdInterface extends BaseAggregateIdInterface, AggregateIdType {
  agency_id: string;
}
