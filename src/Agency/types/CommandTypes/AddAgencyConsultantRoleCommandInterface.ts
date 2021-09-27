import {AgencyCommandEnum} from '../AgencyCommandEnum';
import {AddAgencyConsultantRoleCommandDataInterface} from '../CommandDataTypes';

export interface AddAgencyConsultantRoleCommandInterface {
  type: AgencyCommandEnum.ADD_AGENCY_CONSULTANT_ROLE;
  data: AddAgencyConsultantRoleCommandDataInterface;
}
