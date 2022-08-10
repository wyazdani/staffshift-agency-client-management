import {BaseAggregateIdInterface} from 'BaseAggregateIdInterface';
import {AggregateIdType} from '../../../models/EventStore';

export interface FinancialHoldAggregateIdInterface extends BaseAggregateIdInterface, AggregateIdType {
  name: 'financial_hold';
  client_id: string;
}
