import {AgencyCommandEnum} from '../AgencyCommandEnum';
import {EnableAgencyConsultantRoleCommandDataInterface} from '../CommandDataTypes';

export interface EnableAgencyConsultantRoleCommandInterface {
  type: AgencyCommandEnum.ENABLE_AGENCY_CONSULTANT_ROLE;
  data: EnableAgencyConsultantRoleCommandDataInterface;
}
