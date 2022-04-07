import {AgencyClientAggregateCommandInterface} from '../AgencyClientAggregateCommandInterface';
import {AgencyClientCommandEnum} from '../AgencyClientCommandEnum';
import {RemoveAgencyClientConsultantCommandDataInterface} from '../CommandDataTypes';

export interface RemoveAgencyClientConsultantCommandInterface extends AgencyClientAggregateCommandInterface {
  type: AgencyClientCommandEnum.REMOVE_AGENCY_CLIENT_CONSULTANT;
  data: RemoveAgencyClientConsultantCommandDataInterface;
}
