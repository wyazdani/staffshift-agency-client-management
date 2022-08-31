import {ValidationError} from 'a24-node-error-utils';
import {AbstractAggregate} from '../../../src/aggregates/AbstractAggregate';
import {BookingPreferenceAggregate} from '../../../src/aggregates/BookingPreference/BookingPreferenceAggregate';
import {
  BookingPreferenceAggregateIdInterface,
  BookingPreferenceAggregateRecordInterface
} from '../../../src/aggregates/BookingPreference/types';

describe('BookingPreferenceAggregate', () => {
  const aggregateId: BookingPreferenceAggregateIdInterface = {
    name: 'booking_preference',
    agency_id: 'agency id',
    client_id: 'client id'
  };

  it('Test inheritance of AbstractAggregate', () => {
    const aggregate: BookingPreferenceAggregateRecordInterface = {
      last_sequence_id: 0
    };
    const bookingPreferenceAggregate = new BookingPreferenceAggregate(aggregateId, aggregate);

    bookingPreferenceAggregate.should.be.instanceof(AbstractAggregate);
  });
  describe('validateSetRequiresPONumber()', () => {
    it('Test when aggregate does not have any events in it', async () => {
      const aggregate = {
        last_sequence_id: 0
      };
      const bookingPreferenceAggregate = new BookingPreferenceAggregate(aggregateId, aggregate);

      await bookingPreferenceAggregate.validateSetRequiresPONumber();
    });

    it('Test when requires PO Number is set error', async () => {
      const aggregate = {
        last_sequence_id: 1,
        requires_po_number: true
      };
      const bookingPreferenceAggregate = new BookingPreferenceAggregate(aggregateId, aggregate);

      const error = await bookingPreferenceAggregate
        .validateSetRequiresPONumber()
        .should.be.rejectedWith(ValidationError);

      error.assertEqual(
        new ValidationError('PO Number is already set').setErrors([
          {
            code: 'ALREADY_SET',
            message: 'PO Number is already set'
          }
        ])
      );
    });

    it('Test when requires PO Number is not set', async () => {
      const aggregate = {
        last_sequence_id: 1,
        requires_po_number: false
      };
      const bookingPreferenceAggregate = new BookingPreferenceAggregate(aggregateId, aggregate);

      await bookingPreferenceAggregate.validateSetRequiresPONumber();
    });
  });
});
