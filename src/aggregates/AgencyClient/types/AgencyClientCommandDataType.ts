import {
  AddAgencyClientConsultantCommandDataInterface,
  LinkAgencyClientCommandDataInterface,
  RemoveAgencyClientConsultantCommandDataInterface,
  SyncAgencyClientCommandDataInterface,
  UnlinkAgencyClientCommandDataInterface, TransferAgencyClientConsultantCommandDataInterface
} from './CommandDataTypes';

export type AgencyClientCommandDataType =
  | AddAgencyClientConsultantCommandDataInterface
  | LinkAgencyClientCommandDataInterface
  | RemoveAgencyClientConsultantCommandDataInterface
  | SyncAgencyClientCommandDataInterface
  | UnlinkAgencyClientCommandDataInterface
  | TransferAgencyClientConsultantCommandDataInterface;
