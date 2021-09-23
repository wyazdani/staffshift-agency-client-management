import {AggregateEvent} from '../EventRepository';
import {AgencyClientCommandEnum, AgencyClientEventType} from './AgencyClientEnums';
import {AgencyCommandEnums} from '../Agency/AgencyEnums';
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

export interface LinkAgencyClientCommandData {
  client_type: string;
  organisation_id?: string;
  site_id?: string;
}

export interface UnlinkAgencyClientCommandData {
  client_type: string;
  organisation_id?: string;
  site_id?: string;
}

export interface SyncAgencyClientCommandData {
  client_type: string;
  linked: boolean;
  linked_at: Date;
  organisation_id?: string;
  site_id?: string;
}

export type AgencyClientCommandData = LinkAgencyClientCommandData | UnlinkAgencyClientCommandData |
    SyncAgencyClientCommandData | AgencyClientConsultant;

export interface AgencyClientCommand {
  type: string
  data: AgencyClientCommandData
}

export interface AgencyClientCommandHandlerInterface {
  commandType: string;
  execute(agencyId: string, clientId: string, commandData: AgencyClientCommandData): Promise<void>;
}