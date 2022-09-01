import {BookingPreferenceCommandEnum} from '../BookingPreferenceCommandEnum';
import {BookingPreferenceCommandInterface} from '..';

export interface UnsetRequiresUniquePONumberCommandDataInterface {}

export interface UnsetRequiresUniquePONumberCommandInterface extends BookingPreferenceCommandInterface {
  type: BookingPreferenceCommandEnum.UNSET_REQUIRES_UNIQUE_PO_NUMBER;
  data: UnsetRequiresUniquePONumberCommandDataInterface;
}
