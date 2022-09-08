import {assert} from 'chai';
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

      bookingPreferenceAggregate.validateSetRequiresPONumber();
    });

    it('Test when requires PO Number is set', async () => {
      const aggregate = {
        last_sequence_id: 1,
        requires_po_number: true
      };
      const bookingPreferenceAggregate = new BookingPreferenceAggregate(aggregateId, aggregate);

      try {
        bookingPreferenceAggregate.validateSetRequiresPONumber();
        assert.fail('It should not happen');
      } catch (error) {
        error.assertEqual(
          new ValidationError('Could not run command as state was already set').setErrors([
            {
              code: 'ALREADY_SET',
              message: 'Requires PO Number is already set'
            }
          ])
        );
      }
    });

    it('Test when requires PO Number is false', async () => {
      const aggregate = {
        last_sequence_id: 1,
        requires_po_number: false
      };
      const bookingPreferenceAggregate = new BookingPreferenceAggregate(aggregateId, aggregate);

      bookingPreferenceAggregate.validateSetRequiresPONumber();
    });
  });

  describe('validateUnsetRequiresPONumber()', () => {
    it('Test when aggregate does not have any events in it', async () => {
      const aggregate = {
        last_sequence_id: 0
      };
      const bookingPreferenceAggregate = new BookingPreferenceAggregate(aggregateId, aggregate);

      try {
        bookingPreferenceAggregate.validateUnsetRequiresPONumber();
        assert.fail('It should not happen');
      } catch (error) {
        error.assertEqual(
          new ValidationError('Could not run command as state was already not set').setErrors([
            {
              code: 'ALREADY_NOT_SET',
              message: 'Requires PO Number is already not set'
            }
          ])
        );
      }
    });

    it('Test when requires PO Number is false', async () => {
      const aggregate = {
        last_sequence_id: 1,
        requires_po_number: false
      };
      const bookingPreferenceAggregate = new BookingPreferenceAggregate(aggregateId, aggregate);

      try {
        bookingPreferenceAggregate.validateUnsetRequiresPONumber();
        assert.fail('It should not happen');
      } catch (error) {
        error.assertEqual(
          new ValidationError('Could not run command as state was already not set').setErrors([
            {
              code: 'ALREADY_NOT_SET',
              message: 'Requires PO Number is already not set'
            }
          ])
        );
      }
    });

    it('Test when requires PO Number is set', async () => {
      const aggregate = {
        last_sequence_id: 1,
        requires_po_number: true
      };
      const bookingPreferenceAggregate = new BookingPreferenceAggregate(aggregateId, aggregate);

      await bookingPreferenceAggregate.validateUnsetRequiresPONumber();
    });
  });

  describe('validateSetRequiresUniquePONumber()', () => {
    it('Test when aggregate does not have any events in it', async () => {
      const aggregate = {
        last_sequence_id: 0
      };
      const bookingPreferenceAggregate = new BookingPreferenceAggregate(aggregateId, aggregate);

      try {
        bookingPreferenceAggregate.validateSetRequiresUniquePONumber();
        assert.fail('It should not happen');
      } catch (error) {
        error.assertEqual(
          new ValidationError('Could not run command as state was not set').setErrors([
            {
              code: 'PO_NUMBER_NOT_SET',
              message: 'Requires PO Number is not set'
            }
          ])
        );
      }
    });

    it('Test when requires unique PO Number is false', async () => {
      const aggregate = {
        last_sequence_id: 1,
        requires_po_number: true,
        requires_unique_po_number: false
      };
      const bookingPreferenceAggregate = new BookingPreferenceAggregate(aggregateId, aggregate);

      bookingPreferenceAggregate.validateSetRequiresUniquePONumber();
    });

    it('Test when requires unique PO Number is set', async () => {
      const aggregate = {
        last_sequence_id: 1,
        requires_po_number: true,
        requires_unique_po_number: true
      };
      const bookingPreferenceAggregate = new BookingPreferenceAggregate(aggregateId, aggregate);

      try {
        bookingPreferenceAggregate.validateSetRequiresUniquePONumber();
        assert.fail('It should not happen');
      } catch (error) {
        error.assertEqual(
          new ValidationError('Could not run command as state was already set').setErrors([
            {
              code: 'ALREADY_SET',
              message: 'Requires Unique PO Number is already set'
            }
          ])
        );
      }
    });

    it('Test when requires PO Number is false', async () => {
      const aggregate = {
        last_sequence_id: 1,
        requires_po_number: false,
        requires_unique_po_number: false
      };
      const bookingPreferenceAggregate = new BookingPreferenceAggregate(aggregateId, aggregate);

      try {
        bookingPreferenceAggregate.validateSetRequiresUniquePONumber();
        assert.fail('It should not happen');
      } catch (error) {
        error.assertEqual(
          new ValidationError('Could not run command as state was not set').setErrors([
            {
              code: 'PO_NUMBER_NOT_SET',
              message: 'Requires PO Number is not set'
            }
          ])
        );
      }
    });
  });

  describe('validateUnsetRequiresUniquePONumber()', () => {
    it('Test when aggregate does not have any events in it', async () => {
      const aggregate = {
        last_sequence_id: 0
      };
      const bookingPreferenceAggregate = new BookingPreferenceAggregate(aggregateId, aggregate);

      try {
        bookingPreferenceAggregate.validateUnsetRequiresUniquePONumber();
        assert.fail('It should not happen');
      } catch (error) {
        error.assertEqual(
          new ValidationError('Could not run command as state was already not set').setErrors([
            {
              code: 'ALREADY_NOT_SET',
              message: 'Requires Unique PO Number is already not set'
            }
          ])
        );
      }
    });

    it('Test when requires unique PO Number is false', async () => {
      const aggregate = {
        last_sequence_id: 1,
        requires_unique_po_number: false
      };
      const bookingPreferenceAggregate = new BookingPreferenceAggregate(aggregateId, aggregate);

      try {
        bookingPreferenceAggregate.validateUnsetRequiresUniquePONumber();
        assert.fail('It should not happen');
      } catch (error) {
        error.assertEqual(
          new ValidationError('Could not run command as state was already not set').setErrors([
            {
              code: 'ALREADY_NOT_SET',
              message: 'Requires Unique PO Number is already not set'
            }
          ])
        );
      }
    });

    it('Test when requires unique PO Number is set', async () => {
      const aggregate = {
        last_sequence_id: 1,
        requires_unique_po_number: true
      };
      const bookingPreferenceAggregate = new BookingPreferenceAggregate(aggregateId, aggregate);

      bookingPreferenceAggregate.validateUnsetRequiresUniquePONumber();
    });
  });

  describe('validateSetRequiresBookingPassword()', () => {
    it('Test when aggregate does not have any events in it', async () => {
      const aggregate = {
        last_sequence_id: 0
      };
      const bookingPreferenceAggregate = new BookingPreferenceAggregate(aggregateId, aggregate);

      bookingPreferenceAggregate.validateSetRequiresBookingPassword();
    });

    it('Test when requires booking password is false', async () => {
      const aggregate = {
        last_sequence_id: 1,
        requires_booking_password: false
      };
      const bookingPreferenceAggregate = new BookingPreferenceAggregate(aggregateId, aggregate);

      bookingPreferenceAggregate.validateSetRequiresBookingPassword();
    });

    it('Test when requires booking password is set', async () => {
      const aggregate = {
        last_sequence_id: 1,
        requires_booking_password: true
      };
      const bookingPreferenceAggregate = new BookingPreferenceAggregate(aggregateId, aggregate);

      try {
        bookingPreferenceAggregate.validateSetRequiresBookingPassword();
        assert.fail('It should not happen');
      } catch (error) {
        error.assertEqual(
          new ValidationError('Could not run command as state was already set').setErrors([
            {
              code: 'ALREADY_SET',
              message: 'Requires booking password is already set'
            }
          ])
        );
      }
    });
  });

  describe('validateUnsetRequiresBookingPassword()', () => {
    it('Test when aggregate does not have any events in it', async () => {
      const aggregate = {
        last_sequence_id: 0
      };
      const bookingPreferenceAggregate = new BookingPreferenceAggregate(aggregateId, aggregate);

      try {
        bookingPreferenceAggregate.validateUnsetRequiresBookingPassword();
        assert.fail('It should not happen');
      } catch (error) {
        error.assertEqual(
          new ValidationError('Could not run command as state was already not set').setErrors([
            {
              code: 'ALREADY_NOT_SET',
              message: 'Requires booking password is already not set'
            }
          ])
        );
      }
    });

    it('Test when requires booking password is false', async () => {
      const aggregate = {
        last_sequence_id: 1,
        requires_booking_password: false
      };
      const bookingPreferenceAggregate = new BookingPreferenceAggregate(aggregateId, aggregate);

      try {
        bookingPreferenceAggregate.validateUnsetRequiresBookingPassword();
        assert.fail('It should not happen');
      } catch (error) {
        error.assertEqual(
          new ValidationError('Could not run command as state was already not set').setErrors([
            {
              code: 'ALREADY_NOT_SET',
              message: 'Requires booking password is already not set'
            }
          ])
        );
      }
    });

    it('Test when requires booking password is set', async () => {
      const aggregate = {
        last_sequence_id: 1,
        requires_booking_password: true
      };
      const bookingPreferenceAggregate = new BookingPreferenceAggregate(aggregateId, aggregate);

      bookingPreferenceAggregate.validateUnsetRequiresBookingPassword();
    });
  });

  describe('validateUpdateBookingPasswords()', () => {
    it('Test when aggregate does not have any events in it', async () => {
      const aggregate = {
        last_sequence_id: 0
      };
      const bookingPreferenceAggregate = new BookingPreferenceAggregate(aggregateId, aggregate);

      try {
        bookingPreferenceAggregate.validateUpdateBookingPasswords();
        assert.fail('It should not happen');
      } catch (error) {
        error.assertEqual(
          new ValidationError('Could not run command as state was already not set').setErrors([
            {
              code: 'REQUIRES_BOOKING_PASSWORD_NOT_SET',
              message: 'Requires booking password is already not set'
            }
          ])
        );
      }
    });

    it('Test when requires booking password is false', async () => {
      const aggregate = {
        last_sequence_id: 1,
        requires_booking_password: false
      };
      const bookingPreferenceAggregate = new BookingPreferenceAggregate(aggregateId, aggregate);

      try {
        bookingPreferenceAggregate.validateUpdateBookingPasswords();
        assert.fail('It should not happen');
      } catch (error) {
        error.assertEqual(
          new ValidationError('Could not run command as state was already not set').setErrors([
            {
              code: 'REQUIRES_BOOKING_PASSWORD_NOT_SET',
              message: 'Requires booking password is already not set'
            }
          ])
        );
      }
    });

    it('Test when requires unique booking password is set', async () => {
      const aggregate = {
        last_sequence_id: 1,
        requires_booking_password: true
      };
      const bookingPreferenceAggregate = new BookingPreferenceAggregate(aggregateId, aggregate);

      bookingPreferenceAggregate.validateUpdateBookingPasswords();
    });
  });

  describe('validateSetRequiresShiftRefNumber()', () => {
    it('Test when aggregate does not have any events in it', async () => {
      const aggregate = {
        last_sequence_id: 0
      };
      const bookingPreferenceAggregate = new BookingPreferenceAggregate(aggregateId, aggregate);

      bookingPreferenceAggregate.validateSetRequiresShiftRefNumber();
    });
    it('Test throw error when Shift Ref Number is set', async () => {
      const aggregate = {
        last_sequence_id: 1,
        requires_shift_ref_number: true
      };
      const bookingPreferenceAggregate = new BookingPreferenceAggregate(aggregateId, aggregate);

      try {
        bookingPreferenceAggregate.validateSetRequiresShiftRefNumber();
        assert.fail('It should not happen');
      } catch (error) {
        error.assertEqual(
          new ValidationError('Could not run command as state was already set').setErrors([
            {
              code: 'ALREADY_SET',
              message: 'Requires Shift Ref Number is already set'
            }
          ])
        );
      }
    });

    it('Test when requires Shift Ref Number is defined as false', async () => {
      const aggregate = {
        last_sequence_id: 1,
        requires_shift_ref_number: false
      };
      const bookingPreferenceAggregate = new BookingPreferenceAggregate(aggregateId, aggregate);

      bookingPreferenceAggregate.validateSetRequiresShiftRefNumber();
    });
  });

  describe('validateUnsetRequiresShiftRefNumber()', () => {
    it('Test when aggregate does not have any events in it', async () => {
      const aggregate = {
        last_sequence_id: 0
      };
      const bookingPreferenceAggregate = new BookingPreferenceAggregate(aggregateId, aggregate);

      try {
        bookingPreferenceAggregate.validateUnsetRequiresShiftRefNumber();
        assert.fail('It should not happen');
      } catch (error) {
        error.assertEqual(
          new ValidationError('Could not run command as state was already not set').setErrors([
            {
              code: 'ALREADY_NOT_SET',
              message: 'Requires Shift Ref Number is already not set'
            }
          ])
        );
      }
    });

    it('Test throw error when Shift Ref Number is defined as false', async () => {
      const aggregate = {
        last_sequence_id: 1,
        requires_shift_ref_number: false
      };
      const bookingPreferenceAggregate = new BookingPreferenceAggregate(aggregateId, aggregate);

      try {
        bookingPreferenceAggregate.validateUnsetRequiresShiftRefNumber();
        assert.fail('It should not happen');
      } catch (error) {
        error.assertEqual(
          new ValidationError('Could not run command as state was already not set').setErrors([
            {
              code: 'ALREADY_NOT_SET',
              message: 'Requires Shift Ref Number is already not set'
            }
          ])
        );
      }
    });

    it('Test when requires Shift Ref Number is set', async () => {
      const aggregate = {
        last_sequence_id: 1,
        requires_shift_ref_number: true
      };
      const bookingPreferenceAggregate = new BookingPreferenceAggregate(aggregateId, aggregate);

      bookingPreferenceAggregate.validateUnsetRequiresShiftRefNumber();
    });
  });
});
