import {BookingPreferenceCommandEnum} from '../BookingPreferenceCommandEnum';
import {BookingPreferenceCommandInterface} from '..';

export interface SetRequiresUniquePONumberCommandDataInterface {}

export interface SetRequiresUniquePONumberCommandInterface extends BookingPreferenceCommandInterface {
  type: BookingPreferenceCommandEnum.SET_REQUIRES_UNIQUE_PO_NUMBER;
  data: SetRequiresUniquePONumberCommandDataInterface;
}
