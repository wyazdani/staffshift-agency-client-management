import {BookingPreferenceCommandEnum} from '../BookingPreferenceCommandEnum';
import {BookingPreferenceCommandInterface} from '..';

export interface UnsetRequiresBookingPasswordCommandDataInterface {}

export interface UnsetRequiresBookingPasswordCommandInterface extends BookingPreferenceCommandInterface {
  type: BookingPreferenceCommandEnum.UNSET_REQUIRES_BOOKING_PASSWORD;
  data: UnsetRequiresBookingPasswordCommandDataInterface;
}
