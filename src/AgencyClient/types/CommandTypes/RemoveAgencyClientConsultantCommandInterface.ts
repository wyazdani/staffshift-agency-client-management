import {AgencyClientCommandEnum} from '../AgencyClientCommandEnum';
import {RemoveAgencyClientConsultantCommandDataInterface} from '../CommandDataTypes';

export interface RemoveAgencyClientConsultantCommandInterface {
  type: AgencyClientCommandEnum.REMOVE_AGENCY_CLIENT_CONSULTANT;
  data: RemoveAgencyClientConsultantCommandDataInterface;
}
