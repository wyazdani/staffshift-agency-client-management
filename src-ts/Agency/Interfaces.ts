import {AgencyCommandEnums, AgencyConsultantRoleEnums, AgencyEventEnums} from "./Enums";

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
export interface AgencyEvent {
  type: AgencyEventEnums,
  aggregate_id: AgencyAggregateId,
  data: Object,
  sequence_id: number
}
export interface AgencyCommand {
  type: AgencyCommandEnums,
  data: Object
}