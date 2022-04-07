import {AgencyAggregateCommandInterface} from '..';
import {AgencyCommandEnum} from '../AgencyCommandEnum';
import {AddAgencyConsultantRoleCommandDataInterface} from '../CommandDataTypes';

export interface AddAgencyConsultantRoleCommandInterface extends AgencyAggregateCommandInterface {
  type: AgencyCommandEnum.ADD_AGENCY_CONSULTANT_ROLE;
  data: AddAgencyConsultantRoleCommandDataInterface;
}
