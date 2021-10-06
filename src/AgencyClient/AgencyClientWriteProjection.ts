import {differenceWith} from 'lodash';
import {
  AgencyClientAggregateRecordInterface,
  AgencyClientConsultantInterface,
  AgencyClientEventEnum,
  AgencyClientEventInterface
} from './types';
import {
  SyncAgencyClientCommandDataInterface,
  UnlinkAgencyClientCommandDataInterface,
  LinkAgencyClientCommandDataInterface,
  AddAgencyClientConsultantCommandDataInterface,
  RemoveAgencyClientConsultantCommandDataInterface
} from './types/CommandDataTypes';
import {AgencyClientCommandDataType} from './types/AgencyClientCommandDataType';

export type AgencyClientWriteProjectionType = {
  [key in AgencyClientEventEnum]: (
    aggregate: AgencyClientAggregateRecordInterface,
    event: AgencyClientEventInterface<AgencyClientCommandDataType>
  ) => AgencyClientAggregateRecordInterface;
};

export const AgencyClientWriteProjection: AgencyClientWriteProjectionType = {
  [AgencyClientEventEnum.AGENCY_CLIENT_LINKED]: (
    aggregate: AgencyClientAggregateRecordInterface,
    event: AgencyClientEventInterface<LinkAgencyClientCommandDataInterface>
  ): AgencyClientAggregateRecordInterface => {
    aggregate.linked = true;
    aggregate.client_type = event.data.client_type;

    return {...aggregate, last_sequence_id: event.sequence_id};
  },
  [AgencyClientEventEnum.AGENCY_CLIENT_UNLINKED]: (
    aggregate: AgencyClientAggregateRecordInterface,
    event: AgencyClientEventInterface<UnlinkAgencyClientCommandDataInterface>
  ): AgencyClientAggregateRecordInterface => {
    aggregate.linked = false;

    return {...aggregate, last_sequence_id: event.sequence_id};
  },
  [AgencyClientEventEnum.AGENCY_CLIENT_SYNCED]: (
    aggregate: AgencyClientAggregateRecordInterface,
    event: AgencyClientEventInterface<SyncAgencyClientCommandDataInterface>
  ): AgencyClientAggregateRecordInterface => {
    aggregate.linked = event.data.linked;
    aggregate.client_type = event.data.client_type;

    return {...aggregate, last_sequence_id: event.sequence_id};
  },
  [AgencyClientEventEnum.AGENCY_CLIENT_CONSULTANT_ASSIGNED]: (
    aggregate: AgencyClientAggregateRecordInterface,
    event: AgencyClientEventInterface<AddAgencyClientConsultantCommandDataInterface>
  ): AgencyClientAggregateRecordInterface => {
    const consultant: AgencyClientConsultantInterface = {
      _id: event.data._id as string,
      consultant_role_id: event.data.consultant_role_id as string,
      consultant_id: event.data.consultant_id as string
    };

    aggregate.consultants ? aggregate.consultants.push(consultant) : (aggregate.consultants = [consultant]);

    return {...aggregate, last_sequence_id: event.sequence_id};
  },
  [AgencyClientEventEnum.AGENCY_CLIENT_CONSULTANT_UNASSIGNED]: (
    aggregate: AgencyClientAggregateRecordInterface,
    event: AgencyClientEventInterface<RemoveAgencyClientConsultantCommandDataInterface>
  ): AgencyClientAggregateRecordInterface => {
    aggregate.consultants = differenceWith(
      aggregate.consultants,
      [event.data],
      (value, other) => value._id == other._id
    );

    return {...aggregate, last_sequence_id: event.sequence_id};
  }
};
