import {AggregateEvent} from '../EventRepository';
import {AgencyClientCommandEnum, AgencyClientEventEnum} from './AgencyClientEnums';
import {GenericObjectInterface} from 'GenericObjectInterface';

export interface AgencyClientConsultantInterface {
  _id?: string,
  consultant_role_id?: string,
  consultant_id?: string,
  client_type?: string,
  linked?: boolean,
  organisation_id?: string,
  site_id?: string
}

export interface AgencyClientAggregateRecordInterface {
  last_sequence_id: number,
  linked?: boolean,
  client_type?: string,
  consultants?: AgencyClientConsultantInterface[]
}

export interface AgencyClientAggregateIdInterface {
  agency_id: string,
  client_id: string
}

export interface AgencyClientEventInterface extends AggregateEvent {
  type: AgencyClientEventEnum,
  aggregate_id: AgencyClientAggregateIdInterface,
  data: GenericObjectInterface,
  sequence_id: number
}

export interface AgencyClientCommandInterface {
  type: AgencyClientCommandEnum
  data: AgencyClientConsultantInterface
}