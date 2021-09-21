import {ObjectID} from 'mongodb';
import {AgencyAggregate} from './AgencyAggregate';
import {GenericObjectInterface} from 'GenericObjectInterface';
import {AgencyEventInterface, AgencyCommandEnum, AgencyEventEnum} from './types';

type AgencyCommandsType = {
  [key in AgencyCommandEnum]: (
    aggregate: AgencyAggregate,
    command: GenericObjectInterface
  ) => Promise<AgencyEventInterface[]>;
};

export const AgencyCommands: AgencyCommandsType = {
  [AgencyCommandEnum.ADD_AGENCY_CONSULTANT_ROLE]: async (
    aggregate: AgencyAggregate,
    command: GenericObjectInterface
  ): Promise<AgencyEventInterface[]> => {
    let eventId = aggregate.getLastEventId();

    // We are looking to auto enabled a newly created consultant roles
    const consultantId = new ObjectID().toString();

    return [
      {
        type: AgencyEventEnum.AGENCY_CONSULTANT_ROLE_ADDED,
        aggregate_id: aggregate.getId(),
        data: {
          _id: consultantId,
          name: command.name,
          description: command.description,
          max_consultants: command.max_consultants
        },
        sequence_id: ++eventId
      },
      {
        type: AgencyEventEnum.AGENCY_CONSULTANT_ROLE_ENABLED,
        aggregate_id: aggregate.getId(),
        data: {
          _id: consultantId
        },
        sequence_id: ++eventId
      }
    ];
  },
  [AgencyCommandEnum.UPDATE_AGENCY_CONSULTANT_ROLE]: async (
    aggregate: AgencyAggregate,
    command: GenericObjectInterface
  ): Promise<AgencyEventInterface[]> => {
    let eventId = aggregate.getLastEventId();

    // Should this be one event or many
    // We may want one event per business case
    return [
      {
        type: AgencyEventEnum.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED,
        aggregate_id: aggregate.getId(),
        data: {...command},
        sequence_id: ++eventId
      }
    ];
  },
  [AgencyCommandEnum.ENABLE_AGENCY_CONSULTANT_ROLE]: async (
    aggregate: AgencyAggregate,
    command: GenericObjectInterface
  ): Promise<AgencyEventInterface[]> => {
    let eventId = aggregate.getLastEventId();

    if (!aggregate.canEnableConsultantRole(command._id as string)) {
      return [];
    }

    return [
      {
        type: AgencyEventEnum.AGENCY_CONSULTANT_ROLE_ENABLED,
        aggregate_id: aggregate.getId(),
        data: {
          _id: command._id
        },
        sequence_id: ++eventId
      }
    ];
  },
  [AgencyCommandEnum.DISABLE_AGENCY_CONSULTANT_ROLE]: async (
    aggregate: AgencyAggregate,
    command: GenericObjectInterface
  ): Promise<AgencyEventInterface[]> => {
    let eventId = aggregate.getLastEventId();

    if (!aggregate.canDisableConsultantRole(command._id as string)) {
      return [];
    }

    return [
      {
        type: AgencyEventEnum.AGENCY_CONSULTANT_ROLE_DISABLED,
        aggregate_id: aggregate.getId(),
        data: {
          _id: command._id
        },
        sequence_id: ++eventId
      }
    ];
  }
};
