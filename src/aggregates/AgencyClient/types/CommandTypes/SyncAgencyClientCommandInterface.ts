import {AgencyClientAggregateCommandInterface} from '../AgencyClientAggregateCommandInterface';
import {AgencyClientCommandEnum} from '../AgencyClientCommandEnum';
import {SyncAgencyClientCommandDataInterface} from '../CommandDataTypes';

export interface SyncAgencyClientCommandInterface extends AgencyClientAggregateCommandInterface {
  type: AgencyClientCommandEnum.SYNC_AGENCY_CLIENT;
  data: SyncAgencyClientCommandDataInterface;
}
