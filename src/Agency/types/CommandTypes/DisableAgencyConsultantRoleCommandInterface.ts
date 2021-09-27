import {AgencyCommandEnum} from '../AgencyCommandEnum';
import {DisableAgencyConsultantRoleCommandDataInterface} from '../CommandDataTypes';

export interface DisableAgencyConsultantRoleCommandInterface {
  type: AgencyCommandEnum.DISABLE_AGENCY_CONSULTANT_ROLE;
  data: DisableAgencyConsultantRoleCommandDataInterface;
}
