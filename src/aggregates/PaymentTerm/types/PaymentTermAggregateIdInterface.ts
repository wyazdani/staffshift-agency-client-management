import {BaseAggregateIdInterface} from 'BaseAggregateIdInterface';
import {AggregateIdType} from '../../../models/EventStore';

export interface PaymentTermAggregateIdInterface extends BaseAggregateIdInterface, AggregateIdType {
  name: 'payment_term';
  client_id: string;
}
