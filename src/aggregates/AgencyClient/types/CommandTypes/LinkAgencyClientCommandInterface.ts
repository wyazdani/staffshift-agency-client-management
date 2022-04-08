import {AgencyClientCommandInterface} from '../AgencyClientCommandInterface';
import {AgencyClientCommandEnum} from '../AgencyClientCommandEnum';
import {LinkAgencyClientCommandDataInterface} from '../CommandDataTypes';

export interface LinkAgencyClientCommandInterface extends AgencyClientCommandInterface {
  type: AgencyClientCommandEnum.LINK_AGENCY_CLIENT;
  data: LinkAgencyClientCommandDataInterface;
}
