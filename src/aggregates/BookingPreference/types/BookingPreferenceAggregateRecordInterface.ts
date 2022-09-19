import {BaseAggregateRecordInterface} from 'BaseAggregateRecordInterface';

export interface BookingPreferenceAggregateRecordInterface extends BaseAggregateRecordInterface {
  requires_po_number?: boolean;
  requires_unique_po_number?: boolean;
  requires_booking_password?: boolean;
  booking_passwords?: string[];
  requires_shift_ref_number?: boolean;
}
