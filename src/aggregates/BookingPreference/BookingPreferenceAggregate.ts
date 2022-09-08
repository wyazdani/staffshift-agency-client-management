import {BookingPreferenceAggregateIdInterface, BookingPreferenceAggregateRecordInterface} from './types';
import {AbstractAggregate} from '../AbstractAggregate';
import {ValidationError} from 'a24-node-error-utils';

export class BookingPreferenceAggregate extends AbstractAggregate<
  BookingPreferenceAggregateIdInterface,
  BookingPreferenceAggregateRecordInterface
> {
  constructor(
    protected id: BookingPreferenceAggregateIdInterface,
    protected aggregate: BookingPreferenceAggregateRecordInterface
  ) {
    super(id, aggregate);
  }

  /**
   * checks if requires_po_number is not set
   */
  validateSetRequiresPONumber(): void {
    if (this.aggregate.requires_po_number == true) {
      throw new ValidationError('Could not run command as state is already set').setErrors([
        {
          code: 'ALREADY_SET',
          message: 'Requires PO Number is already set'
        }
      ]);
    }
  }

  /**
   * checks if requires_po_number is set
   */
  validateUnsetRequiresPONumber(): void {
    if (!this.aggregate.requires_po_number) {
      throw new ValidationError('Could not run command as state is already not set').setErrors([
        {
          code: 'ALREADY_NOT_SET',
          message: 'Requires PO Number is already not set'
        }
      ]);
    }
  }

  /**
   * checks if requires_unique_po_number is not set
   * checks if requires_po_number is set
   */
  validateSetRequiresUniquePONumber(): void {
    if (this.aggregate.requires_unique_po_number == true) {
      throw new ValidationError('Could not run command as state is already set').setErrors([
        {
          code: 'ALREADY_SET',
          message: 'Requires Unique PO Number is already set'
        }
      ]);
    }
    if (!this.aggregate.requires_po_number) {
      throw new ValidationError('Could not run command as state is not set').setErrors([
        {
          code: 'PO_NUMBER_NOT_SET',
          message: 'Requires PO Number is not set'
        }
      ]);
    }
  }

  /**
   * checks if requires_unique_po_number is set
   */
  validateUnsetRequiresUniquePONumber(): void {
    if (!this.aggregate.requires_unique_po_number) {
      throw new ValidationError('Could not run command as state is already not set').setErrors([
        {
          code: 'ALREADY_NOT_SET',
          message: 'Requires Unique PO Number is already not set'
        }
      ]);
    }
  }

  /**
   * checks if requires_booking_password is not set
   */
  validateSetRequiresBookingPassword(): void {
    if (this.aggregate.requires_booking_password == true) {
      throw new ValidationError('Could not run command as state is already set').setErrors([
        {
          code: 'ALREADY_SET',
          message: 'Requires booking password is already set'
        }
      ]);
    }
  }

  /**
   * checks if requires_booking_password is set
   */
  validateUnsetRequiresBookingPassword(): void {
    if (!this.aggregate.requires_booking_password) {
      throw new ValidationError('Could not run command as state is already not set').setErrors([
        {
          code: 'ALREADY_NOT_SET',
          message: 'Requires booking password is already not set'
        }
      ]);
    }
  }

  /**
   * checks if requires_booking_password is set
   */
  validateUpdateBookingPasswords(): void {
    if (!this.aggregate.requires_booking_password) {
      throw new ValidationError('Could not run command as state is already not set').setErrors([
        {
          code: 'REQUIRES_BOOKING_PASSWORD_NOT_SET',
          message: 'Requires booking password is already not set'
        }
      ]);
    }
  }

  /**
   * checks if requires_shift_ref_number is not set
   */
  validateSetRequiresShiftRefNumber(): void {
    if (this.aggregate.requires_shift_ref_number === true) {
      throw new ValidationError('Could not run command as state was already set').setErrors([
        {
          code: 'ALREADY_SET',
          message: 'Requires Shift Ref Number is already set'
        }
      ]);
    }
  }

  /**
   * checks if requires_shift_ref_number is set
   */
  validateUnsetRequiresShiftRefNumber(): void {
    if (this.aggregate.requires_shift_ref_number === undefined || this.aggregate.requires_shift_ref_number === false) {
      throw new ValidationError('Could not run command as state was already not set').setErrors([
        {
          code: 'ALREADY_NOT_SET',
          message: 'Requires Shift Ref Number is already not set'
        }
      ]);
    }
  }
}
