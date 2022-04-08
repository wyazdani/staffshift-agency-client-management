import {AgencyCommandInterface} from '../AgencyCommandInterface';
import {AgencyCommandEnum} from '../AgencyCommandEnum';
import {DisableAgencyConsultantRoleCommandDataInterface} from '../CommandDataTypes';

export interface DisableAgencyConsultantRoleCommandInterface extends AgencyCommandInterface {
  type: AgencyCommandEnum.DISABLE_AGENCY_CONSULTANT_ROLE;
  data: DisableAgencyConsultantRoleCommandDataInterface;
}
