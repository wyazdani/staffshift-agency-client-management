import {BookingPreferenceCommandEnum} from '../BookingPreferenceCommandEnum';
import {BookingPreferenceCommandInterface} from '..';

export interface UpdateBookingPasswordsCommandDataInterface {
  booking_passwords: [];
}

export interface UpdateBookingPasswordsCommandInterface extends BookingPreferenceCommandInterface {
  type: BookingPreferenceCommandEnum.UPDATE_BOOKING_PASSWORDS;
  data: UpdateBookingPasswordsCommandDataInterface;
}
