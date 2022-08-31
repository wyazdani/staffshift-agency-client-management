import {BookingPreferenceCommandEnum} from '../BookingPreferenceCommandEnum';
import {BookingPreferenceCommandInterface} from '..';

export interface UnsetRequiresPONumberCommandDataInterface {
  requires_po_number: boolean;
}

export interface UnsetRequiresPONumberCommandInterface extends BookingPreferenceCommandInterface {
  type: BookingPreferenceCommandEnum.UNSET_REQUIRES_PO_NUMBER;
  data: UnsetRequiresPONumberCommandDataInterface;
}
