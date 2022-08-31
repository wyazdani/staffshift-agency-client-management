import {BookingPreferenceCommandEnum} from '../BookingPreferenceCommandEnum';
import {BookingPreferenceCommandInterface} from '..';

export interface SetRequiresPONumberCommandDataInterface {}

export interface SetRequiresPONumberCommandInterface extends BookingPreferenceCommandInterface {
  type: BookingPreferenceCommandEnum.SET_REQUIRES_PO_NUMBER;
  data: SetRequiresPONumberCommandDataInterface;
}
