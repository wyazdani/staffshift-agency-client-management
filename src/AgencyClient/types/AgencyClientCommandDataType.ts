import {AddAgencyClientConsultantCommandDataInterface} from './CommandDataTypes/AddAgencyClientConsultantCommandDataInterface';
import {LinkAgencyClientCommandDataInterface} from './CommandDataTypes/LinkAgencyClientCommandDataInterface';
import {RemoveAgencyClientConsultantCommandDataInterface} from './CommandDataTypes/RemoveAgencyClientConsultantCommandDataInterface';
import {SyncAgencyClientCommandDataInterface} from './CommandDataTypes/SyncAgencyClientCommandDataInterface';
import {UnlinkAgencyClientCommandDataInterface} from './CommandDataTypes/UnlinkAgencyClientCommandDataInterface';

export type AgencyClientCommandDataType =
  | AddAgencyClientConsultantCommandDataInterface
  | LinkAgencyClientCommandDataInterface
  | RemoveAgencyClientConsultantCommandDataInterface
  | SyncAgencyClientCommandDataInterface
  | UnlinkAgencyClientCommandDataInterface;
