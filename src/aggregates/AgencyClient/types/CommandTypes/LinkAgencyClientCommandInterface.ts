import {AgencyClientAggregateCommandInterface} from '../AgencyClientAggregateCommandInterface';
import {AgencyClientCommandEnum} from '../AgencyClientCommandEnum';
import {LinkAgencyClientCommandDataInterface} from '../CommandDataTypes';

export interface LinkAgencyClientCommandInterface extends AgencyClientAggregateCommandInterface {
  type: AgencyClientCommandEnum.LINK_AGENCY_CLIENT;
  data: LinkAgencyClientCommandDataInterface;
}
