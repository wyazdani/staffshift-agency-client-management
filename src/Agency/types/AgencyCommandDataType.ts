import {
  AddAgencyConsultantRoleCommandDataInterface,
  UpdateAgencyConsultantRoleCommandDataInterface,
  EnableAgencyConsultantRoleCommandDataInterface,
  DisableAgencyConsultantRoleCommandDataInterface
} from './CommandDataTypes';

export type AgencyCommandDataType =
  | AddAgencyConsultantRoleCommandDataInterface
  | UpdateAgencyConsultantRoleCommandDataInterface
  | EnableAgencyConsultantRoleCommandDataInterface
  | DisableAgencyConsultantRoleCommandDataInterface;
