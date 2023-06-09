import {BookingPreferenceCommandEnum} from '../BookingPreferenceCommandEnum';
import {BookingPreferenceCommandInterface} from '..';

export interface SetRequiresBookingPasswordCommandDataInterface {
  booking_passwords: Array<string>;
}

export interface SetRequiresBookingPasswordCommandInterface extends BookingPreferenceCommandInterface {
  type: BookingPreferenceCommandEnum.SET_REQUIRES_BOOKING_PASSWORD;
  data: SetRequiresBookingPasswordCommandDataInterface;
}
