import {AgencyClientCommandEnum} from '../AgencyClientCommandEnum';
import {AddAgencyClientConsultantCommandDataInterface} from '../CommandDataTypes';

export interface AddAgencyClientConsultantCommandInterface {
  type: AgencyClientCommandEnum.ADD_AGENCY_CLIENT_CONSULTANT;
  data: AddAgencyClientConsultantCommandDataInterface;
}
