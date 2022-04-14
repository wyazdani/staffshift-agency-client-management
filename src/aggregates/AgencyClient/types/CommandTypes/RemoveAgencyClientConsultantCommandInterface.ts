import {AgencyClientCommandInterface} from '../AgencyClientCommandInterface';
import {AgencyClientCommandEnum} from '../AgencyClientCommandEnum';
import {RemoveAgencyClientConsultantCommandDataInterface} from '../CommandDataTypes';

export interface RemoveAgencyClientConsultantCommandInterface extends AgencyClientCommandInterface {
  type: AgencyClientCommandEnum.REMOVE_AGENCY_CLIENT_CONSULTANT;
  data: RemoveAgencyClientConsultantCommandDataInterface;
}
