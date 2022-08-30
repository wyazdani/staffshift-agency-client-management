import {BookingPreferenceCommandEnum} from '../BookingPreferenceCommandEnum';
import {BookingPreferenceCommandInterface} from '..';

export interface SetRequiresPoNumberCommandDataInterface {
  requires_po_number: boolean;
}

export interface SetRequiresPoNumberCommandInterface extends BookingPreferenceCommandInterface {
  type: BookingPreferenceCommandEnum.SET_REQUIRES_PO_NUMBER;
  data: SetRequiresPoNumberCommandDataInterface;
}
