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
  async validateSetRequiresPONumber(): Promise<void> {
    if (this.aggregate.requires_po_number === true) {
      throw new ValidationError('Could not run command as state was already set').setErrors([
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
  async validateUnsetRequiresPONumber(): Promise<void> {
    if (this.aggregate.requires_po_number === false) {
      throw new ValidationError('Could not run command as state was already not set').setErrors([
        {
          code: 'ALREADY_NOT_SET',
          message: 'Requires PO Number is not set'
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
}
