import {AgencyClientCommandEnum} from '../AgencyClientCommandEnum';
import {LinkAgencyClientCommandDataInterface} from '../CommandDataTypes';

export interface LinkAgencyClientCommandInterface {
  type: AgencyClientCommandEnum.LINK_AGENCY_CLIENT;
  data: LinkAgencyClientCommandDataInterface;
}
