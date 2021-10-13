import {BaseAggregateIdInterface} from 'BaseAggregateIdInterface';
import {AggregateIdType} from '../../models/EventStore';

export interface AgencyClientAggregateIdInterface extends BaseAggregateIdInterface, AggregateIdType {
  client_id: string;
}
