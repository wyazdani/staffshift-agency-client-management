import {AddAgencyClientConsultantCommandDataInterface} from './AddAgencyClientConsultantCommandDataInterface';
import {LinkAgencyClientCommandDataInterface} from './LinkAgencyClientCommandDataInterface';
import {RemoveAgencyClientConsultantCommandDataInterface} from './RemoveAgencyClientConsultantCommandDataInterface';
import {SyncAgencyClientCommandDataInterface} from './SyncAgencyClientCommandDataInterface';
import {UnlinkAgencyClientCommandDataInterface} from './UnlinkAgencyClientCommandDataInterface';

export type AgencyClientCommandDataType =
  | AddAgencyClientConsultantCommandDataInterface
  | LinkAgencyClientCommandDataInterface
  | RemoveAgencyClientConsultantCommandDataInterface
  | SyncAgencyClientCommandDataInterface
  | UnlinkAgencyClientCommandDataInterface;
