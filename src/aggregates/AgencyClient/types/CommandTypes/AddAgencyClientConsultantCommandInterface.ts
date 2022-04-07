import {AgencyClientAggregateCommandInterface} from '../AgencyClientAggregateCommandInterface';
import {AgencyClientCommandEnum} from '../AgencyClientCommandEnum';
import {AddAgencyClientConsultantCommandDataInterface} from '../CommandDataTypes';

export interface AddAgencyClientConsultantCommandInterface extends AgencyClientAggregateCommandInterface {
  type: AgencyClientCommandEnum.ADD_AGENCY_CLIENT_CONSULTANT;
  data: AddAgencyClientConsultantCommandDataInterface;
}
