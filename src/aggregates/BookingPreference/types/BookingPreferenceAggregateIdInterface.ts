import {BaseAggregateIdInterface} from 'BaseAggregateIdInterface';
import {AggregateIdType} from '../../../models/EventStore';

export interface BookingPreferenceAggregateIdInterface extends BaseAggregateIdInterface, AggregateIdType {
  name: 'booking_preference';
  client_id: string;
}
