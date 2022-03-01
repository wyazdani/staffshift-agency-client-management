import {AgencyClientCommandEnum} from '../AgencyClientCommandEnum';
import {UnlinkAgencyClientCommandDataInterface} from '../CommandDataTypes';

export interface UnlinkAgencyClientCommandInterface {
  type: AgencyClientCommandEnum.UNLINK_AGENCY_CLIENT;
  data: UnlinkAgencyClientCommandDataInterface;
}
