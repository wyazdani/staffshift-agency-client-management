import {AgencyCommandInterface} from '../AgencyCommandInterface';
import {AgencyCommandEnum} from '../AgencyCommandEnum';
import {UpdateAgencyConsultantRoleCommandDataInterface} from '../CommandDataTypes';

export interface UpdateAgencyConsultantRoleCommandInterface extends AgencyCommandInterface {
  type: AgencyCommandEnum.UPDATE_AGENCY_CONSULTANT_ROLE;
  data: UpdateAgencyConsultantRoleCommandDataInterface;
}
