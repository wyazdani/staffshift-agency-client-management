import {AggregateEvent} from '../EventRepository';
import {AgencyClientCommandEnum, AgencyClientEventType} from './AgencyClientEnums';
export interface AgencyClientConsultant {
  _id: string,
  consultant_role_id: string,
  consultant_id: string
}

export interface AgencyClientAggregateRecord {
  last_sequence_id: number,
  linked?: boolean,
  client_type?: string,
  consultants?: AgencyClientConsultant[]
}
export interface AgencyClientAggregateId {
  agency_id: string,
  client_id: string
}

export interface AgencyClientEvent extends AggregateEvent {
  type: AgencyClientEventType,
  aggregate_id: AgencyClientAggregateId,
  data: object,
  sequence_id: number
}
export interface AgencyClientCommand {
  type: AgencyClientCommandEnum
  data: object
}