import {AgencyClientCommandEnum} from '../AgencyClientCommandEnum';
import {SyncAgencyClientCommandDataInterface} from '../CommandDataTypes';

export interface SyncAgencyClientCommandInterface {
  type: AgencyClientCommandEnum.SYNC_AGENCY_CLIENT;
  data: SyncAgencyClientCommandDataInterface;
}
