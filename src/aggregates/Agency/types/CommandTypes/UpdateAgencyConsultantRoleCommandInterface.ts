import {AgencyCommandEnum} from '../AgencyCommandEnum';
import {UpdateAgencyConsultantRoleCommandDataInterface} from '../CommandDataTypes';

export interface UpdateAgencyConsultantRoleCommandInterface {
  type: AgencyCommandEnum.UPDATE_AGENCY_CONSULTANT_ROLE;
  data: UpdateAgencyConsultantRoleCommandDataInterface;
}
