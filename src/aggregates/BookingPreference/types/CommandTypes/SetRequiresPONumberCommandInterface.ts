import {BookingPreferenceCommandEnum} from '../BookingPreferenceCommandEnum';
import {BookingPreferenceCommandInterface} from '..';

export interface SetRequiresPONumberCommandDataInterface {
  requires_po_number: boolean;
}

export interface SetRequiresPONumberCommandInterface extends BookingPreferenceCommandInterface {
  type: BookingPreferenceCommandEnum.SET_REQUIRES_PO_NUMBER;
  data: SetRequiresPONumberCommandDataInterface;
}
