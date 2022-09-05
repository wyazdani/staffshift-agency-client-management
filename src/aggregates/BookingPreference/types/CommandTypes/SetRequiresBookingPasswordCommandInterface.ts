import {BookingPreferenceCommandEnum} from '../BookingPreferenceCommandEnum';
import {BookingPreferenceCommandInterface} from '..';

export interface SetRequiresBookingPasswordCommandDataInterface {
  passwords: [];
}

export interface SetRequiresBookingPasswordCommandInterface extends BookingPreferenceCommandInterface {
  type: BookingPreferenceCommandEnum.SET_REQUIRES_BOOKING_PASSWORD;
  data: SetRequiresBookingPasswordCommandDataInterface;
}
