import {AggregateEvent} from '../EventRepository';
import {AgencyCommandEnums, AgencyConsultantRoleEnums, AgencyEventEnums} from './AgencyEnums';

export interface AgencyConsultantRole {
  _id: string,
  name: string,
  description: string,
  max_consultants: number,
  status?: AgencyConsultantRoleEnums
}

export interface AgencyAggregateRecord {
  consultant_roles?: AgencyConsultantRole[],
  last_sequence_id: number
}

export interface AgencyAggregateId {
  agency_id: string
}
export interface AgencyEvent extends AggregateEvent {
  type: AgencyEventEnums,
  aggregate_id: AgencyAggregateId,
  data: object,
  sequence_id: number
}

export interface AddAgencyConsultantRoleCommandData {
  name: string;
  description: string;
  max_consultants: number
}

export interface UpdateAgencyConsultantRoleCommandData {
  _id: string;
  name: string;
  description: string;
  max_consultants: number
}

export interface DisableAgencyConsultantRoleCommandData {
  _id: string
}

export interface EnableAgencyConsultantRoleCommandData {
  _id: string
}

export type AgencyCommandData = AddAgencyConsultantRoleCommandData | DisableAgencyConsultantRoleCommandData | EnableAgencyConsultantRoleCommandData | UpdateAgencyConsultantRoleCommandData;
export interface AgencyCommand {
  type: AgencyCommandEnums,
  data: AgencyCommandData
}

export interface AgencyCommandHandlerInterface {
  commandType: string;
  execute(agencyId: string, commandData: AgencyCommandData): Promise<any>;
}