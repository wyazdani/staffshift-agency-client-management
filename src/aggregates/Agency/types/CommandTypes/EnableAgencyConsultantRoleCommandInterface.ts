import {AgencyCommandInterface} from '../AgencyCommandInterface';
import {AgencyCommandEnum} from '../AgencyCommandEnum';
import {EnableAgencyConsultantRoleCommandDataInterface} from '../CommandDataTypes';

export interface EnableAgencyConsultantRoleCommandInterface extends AgencyCommandInterface {
  type: AgencyCommandEnum.ENABLE_AGENCY_CONSULTANT_ROLE;
  data: EnableAgencyConsultantRoleCommandDataInterface;
}
