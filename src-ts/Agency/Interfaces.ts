import {AgencyCommandEnums, AgencyConsultantRoleEnums, AgencyEventEnums} from "./Enums";

export interface ConsultantRole {
  _id: string,
  name: string,
  description: string,
  max_consultants: number,
  status?: AgencyConsultantRoleEnums
}

export interface AgencyAggregateRecord {
  consultant_roles?: ConsultantRole[],
  last_sequence_id: number
}

export interface Event {
  type: AgencyEventEnums,
  aggregate_id: any,
  data: Object,
  sequence_id: number
}
export interface Command {
  type: AgencyCommandEnums,
  data: Object
}