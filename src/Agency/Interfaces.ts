import {AggregateEvent} from '../EventRepository';
import {AgencyCommandEnum, AgencyConsultantRoleEnum, AgencyEventEnum} from './AgencyEnums';
import {GenericObjectInterface} from 'GenericObjectInterface';

export interface AgencyConsultantRoleInterface {
  _id: string,
  name: string,
  description: string,
  max_consultants: number,
  status?: AgencyConsultantRoleEnum
}

export interface AgencyAggregateRecordInterface {
  consultant_roles?: AgencyConsultantRoleInterface[],
  last_sequence_id: number
}

export interface AgencyAggregateIdInterface {
  agency_id: string
}

export interface AgencyEventInterface extends AggregateEvent {
  type: AgencyEventEnum,
  aggregate_id: AgencyAggregateIdInterface,
  data: GenericObjectInterface,
  sequence_id: number
}

export interface AgencyCommandInterface {
  type: AgencyCommandEnum,
  data: GenericObjectInterface
}