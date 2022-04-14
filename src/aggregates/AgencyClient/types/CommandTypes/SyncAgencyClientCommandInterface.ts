import {AgencyClientCommandInterface} from '../AgencyClientCommandInterface';
import {AgencyClientCommandEnum} from '../AgencyClientCommandEnum';
import {SyncAgencyClientCommandDataInterface} from '../CommandDataTypes';

export interface SyncAgencyClientCommandInterface extends AgencyClientCommandInterface {
  type: AgencyClientCommandEnum.SYNC_AGENCY_CLIENT;
  data: SyncAgencyClientCommandDataInterface;
}
