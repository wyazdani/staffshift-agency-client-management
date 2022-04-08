import {AgencyClientCommandInterface} from '../AgencyClientCommandInterface';
import {AgencyClientCommandEnum} from '../AgencyClientCommandEnum';
import {AddAgencyClientConsultantCommandDataInterface} from '../CommandDataTypes';

export interface AddAgencyClientConsultantCommandInterface extends AgencyClientCommandInterface {
  type: AgencyClientCommandEnum.ADD_AGENCY_CLIENT_CONSULTANT;
  data: AddAgencyClientConsultantCommandDataInterface;
}
