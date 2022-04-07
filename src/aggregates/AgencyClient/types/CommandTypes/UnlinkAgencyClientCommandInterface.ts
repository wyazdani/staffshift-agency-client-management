import {AgencyClientAggregateCommandInterface} from '../AgencyClientAggregateCommandInterface';
import {AgencyClientCommandEnum} from '../AgencyClientCommandEnum';
import {UnlinkAgencyClientCommandDataInterface} from '../CommandDataTypes';

export interface UnlinkAgencyClientCommandInterface extends AgencyClientAggregateCommandInterface {
  type: AgencyClientCommandEnum.UNLINK_AGENCY_CLIENT;
  data: UnlinkAgencyClientCommandDataInterface;
}
