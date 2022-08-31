import {BookingPreferenceAggregateIdInterface, BookingPreferenceAggregateRecordInterface} from './types';
import {AbstractAggregate} from '../AbstractAggregate';

export class FinancialHoldAggregate extends AbstractAggregate<
  BookingPreferenceAggregateIdInterface,
  BookingPreferenceAggregateRecordInterface
> {
  constructor(
    protected id: BookingPreferenceAggregateIdInterface,
    protected aggregate: BookingPreferenceAggregateRecordInterface
  ) {
    super(id, aggregate);
  }
}
