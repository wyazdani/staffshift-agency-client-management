import {AgencyAggregateCommandInterface} from '..';
import {AgencyCommandEnum} from '../AgencyCommandEnum';
import {DisableAgencyConsultantRoleCommandDataInterface} from '../CommandDataTypes';

export interface DisableAgencyConsultantRoleCommandInterface extends AgencyAggregateCommandInterface {
  type: AgencyCommandEnum.DISABLE_AGENCY_CONSULTANT_ROLE;
  data: DisableAgencyConsultantRoleCommandDataInterface;
}
