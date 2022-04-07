import {AgencyAggregateCommandInterface} from '..';
import {AgencyCommandEnum} from '../AgencyCommandEnum';
import {EnableAgencyConsultantRoleCommandDataInterface} from '../CommandDataTypes';

export interface EnableAgencyConsultantRoleCommandInterface extends AgencyAggregateCommandInterface {
  type: AgencyCommandEnum.ENABLE_AGENCY_CONSULTANT_ROLE;
  data: EnableAgencyConsultantRoleCommandDataInterface;
}
