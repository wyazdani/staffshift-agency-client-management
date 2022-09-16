import {BookingPreferenceCommandEnum} from '../BookingPreferenceCommandEnum';
import {BookingPreferenceCommandInterface} from '..';

export interface SetRequiresShiftRefNumberCommandDataInterface {}

export interface SetRequiresShiftRefNumberCommandInterface extends BookingPreferenceCommandInterface {
  type: BookingPreferenceCommandEnum.SET_REQUIRES_SHIFT_REF_NUMBER;
  data: SetRequiresShiftRefNumberCommandDataInterface;
}
