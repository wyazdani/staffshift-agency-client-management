import {
  AddAgencyClientConsultantCommandDataInterface,
  LinkAgencyClientCommandDataInterface,
  RemoveAgencyClientConsultantCommandDataInterface,
  SyncAgencyClientCommandDataInterface,
  UnlinkAgencyClientCommandDataInterface
} from './CommandDataTypes';

export type AgencyClientCommandDataType =
  | AddAgencyClientConsultantCommandDataInterface
  | LinkAgencyClientCommandDataInterface
  | RemoveAgencyClientConsultantCommandDataInterface
  | SyncAgencyClientCommandDataInterface
  | UnlinkAgencyClientCommandDataInterface;
