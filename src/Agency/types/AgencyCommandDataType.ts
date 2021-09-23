import {AddAgencyConsultantRoleCommandDataInterface} from './AddAgencyConsultantRoleCommandDataInterface';
import {UpdateAgencyConsultantRoleCommandDataInterface} from './UpdateAgencyConsultantRoleCommandDataInterface';
import {EnableAgencyConsultantRoleCommandDataInterface} from './EnableAgencyConsultantRoleCommandDataInterface';
import {DisableAgencyConsultantRoleCommandDataInterface} from './DisableAgencyConsultantRoleCommandDataInterface';

export type AgencyCommandDataType =
  | AddAgencyConsultantRoleCommandDataInterface
  | UpdateAgencyConsultantRoleCommandDataInterface
  | EnableAgencyConsultantRoleCommandDataInterface
  | DisableAgencyConsultantRoleCommandDataInterface;
