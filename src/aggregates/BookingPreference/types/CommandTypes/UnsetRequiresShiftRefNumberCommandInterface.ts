import {BookingPreferenceCommandEnum} from '../BookingPreferenceCommandEnum';
import {BookingPreferenceCommandInterface} from '..';

export interface UnsetRequiresShiftRefNumberCommandDataInterface {}

export interface UnsetRequiresShiftRefNumberCommandInterface extends BookingPreferenceCommandInterface {
  type: BookingPreferenceCommandEnum.UNSET_REQUIRES_SHIFT_REF_NUMBER;
  data: UnsetRequiresShiftRefNumberCommandDataInterface;
}
