import {AgencyCommandInterface} from '../AgencyCommandInterface';
import {AgencyCommandEnum} from '../AgencyCommandEnum';
import {AddAgencyConsultantRoleCommandDataInterface} from '../CommandDataTypes';

export interface AddAgencyConsultantRoleCommandInterface extends AgencyCommandInterface {
  type: AgencyCommandEnum.ADD_AGENCY_CONSULTANT_ROLE;
  data: AddAgencyConsultantRoleCommandDataInterface;
}
