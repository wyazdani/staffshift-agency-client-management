import {map} from 'lodash';
import {
  AgencyEventEnum,
  AgencyEventInterface,
  AgencyAggregateRecordInterface,
  AgencyConsultantRoleEnum,
  AgencyConsultantRoleInterface
} from './types';
import {
  AddAgencyConsultantRoleCommandDataInterface,
  DisableAgencyConsultantRoleCommandDataInterface,
  EnableAgencyConsultantRoleCommandDataInterface,
  UpdateAgencyConsultantRoleCommandDataInterface
} from './types/CommandDataTypes';
import {AgencyCommandDataType} from './types/AgencyCommandDataType';

export type AgencyWriteProjectionType = {
  [key in AgencyEventEnum]: (
    aggregate: AgencyAggregateRecordInterface,
    event: AgencyEventInterface<AgencyCommandDataType>
  ) => AgencyAggregateRecordInterface;
};

export const AgencyWriteProjection: AgencyWriteProjectionType = {
  [AgencyEventEnum.AGENCY_CONSULTANT_ROLE_ADDED]: (
    aggregate: AgencyAggregateRecordInterface,
    event: AgencyEventInterface<AddAgencyConsultantRoleCommandDataInterface>
  ): AgencyAggregateRecordInterface => {
    const consultantRole: AgencyConsultantRoleInterface = {
      _id: event.data._id as string,
      name: event.data.name as string,
      description: event.data.description as string,
      max_consultants: event.data.max_consultants as number
    };

    aggregate.consultant_roles
      ? aggregate.consultant_roles.push(consultantRole)
      : (aggregate.consultant_roles = [consultantRole]);

    return {...aggregate, last_sequence_id: event.sequence_id};
  },
  [AgencyEventEnum.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED]: (
    aggregate: AgencyAggregateRecordInterface,
    event: AgencyEventInterface<UpdateAgencyConsultantRoleCommandDataInterface>
  ): AgencyAggregateRecordInterface => {
    aggregate.consultant_roles = map(aggregate.consultant_roles, (item) => {
      if (item._id == event.data._id) {
        return {...item, ...event.data};
      }

      return item;
    });

    return {...aggregate, last_sequence_id: event.sequence_id};
  },
  [AgencyEventEnum.AGENCY_CONSULTANT_ROLE_ENABLED]: (
    aggregate: AgencyAggregateRecordInterface,
    event: AgencyEventInterface<EnableAgencyConsultantRoleCommandDataInterface>
  ): AgencyAggregateRecordInterface => {
    aggregate.consultant_roles = map(aggregate.consultant_roles, (item) => {
      if (item._id == event.data._id) {
        return {...item, status: AgencyConsultantRoleEnum.AGENCY_CONSULTANT_ROLE_STATUS_ENABLED};
      }

      return item;
    });

    return {...aggregate, last_sequence_id: event.sequence_id};
  },
  [AgencyEventEnum.AGENCY_CONSULTANT_ROLE_DISABLED]: (
    aggregate: AgencyAggregateRecordInterface,
    event: AgencyEventInterface<DisableAgencyConsultantRoleCommandDataInterface>
  ): AgencyAggregateRecordInterface => {
    aggregate.consultant_roles = map(aggregate.consultant_roles, (item) => {
      if (item._id == event.data._id) {
        return {...item, status: AgencyConsultantRoleEnum.AGENCY_CONSULTANT_ROLE_STATUS_DISABLED};
      }

      return item;
    });

    return {...aggregate, last_sequence_id: event.sequence_id};
  }
};
