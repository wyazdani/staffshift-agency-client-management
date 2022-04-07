import {AgencyAggregateCommandInterface} from '..';
import {AgencyCommandEnum} from '../AgencyCommandEnum';
import {UpdateAgencyConsultantRoleCommandDataInterface} from '../CommandDataTypes';

export interface UpdateAgencyConsultantRoleCommandInterface extends AgencyAggregateCommandInterface {
  type: AgencyCommandEnum.UPDATE_AGENCY_CONSULTANT_ROLE;
  data: UpdateAgencyConsultantRoleCommandDataInterface;
}
