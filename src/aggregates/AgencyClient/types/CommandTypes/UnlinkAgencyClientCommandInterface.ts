import {AgencyClientCommandInterface} from '../AgencyClientCommandInterface';
import {AgencyClientCommandEnum} from '../AgencyClientCommandEnum';
import {UnlinkAgencyClientCommandDataInterface} from '../CommandDataTypes';

export interface UnlinkAgencyClientCommandInterface extends AgencyClientCommandInterface {
  type: AgencyClientCommandEnum.UNLINK_AGENCY_CLIENT;
  data: UnlinkAgencyClientCommandDataInterface;
}
