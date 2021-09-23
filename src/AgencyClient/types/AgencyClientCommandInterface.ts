import {AgencyClientCommandEnum} from './AgencyClientCommandEnum';
import {LinkAgencyClientCommandDataInterface} from './LinkAgencyClientCommandDataInterface';
import {UnlinkAgencyClientCommandDataInterface} from './UnlinkAgencyClientCommandDataInterface';
import {AddAgencyClientConsultantCommandDataInterface} from './AddAgencyClientConsultantCommandDataInterface';
import {RemoveAgencyClientConsultantCommandDataInterface} from './RemoveAgencyClientConsultantCommandDataInterface';
import {SyncAgencyClientCommandDataInterface} from './SyncAgencyClientCommandDataInterface';

type AgencyClientCommandDataType =
  | LinkAgencyClientCommandDataInterface
  | UnlinkAgencyClientCommandDataInterface
  | AddAgencyClientConsultantCommandDataInterface
  | RemoveAgencyClientConsultantCommandDataInterface
  | SyncAgencyClientCommandDataInterface;

export interface AgencyClientCommandInterface {
  type: AgencyClientCommandEnum;
  data: AgencyClientCommandDataType;
}
