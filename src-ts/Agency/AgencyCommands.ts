'use strict';
import {AgencyCommandEnums, AgencyEventEnums} from './AgencyEnums';
import {ObjectID} from 'mongodb';
import {AgencyAggregate} from "./AgencyAggregate";
import {AgencyEvent} from "./Interfaces";

export const AgencyCommands = {
  [AgencyCommandEnums.ADD_AGENCY_CONSULTANT_ROLE]: async (aggregate: AgencyAggregate, command: any): Promise<AgencyEvent[]> => {
    let eventId = aggregate.getLastEventId();
    // We are looking to auto enabled a newly created consultant roles
    let consultantId = (new ObjectID).toString();
    return [{
      type: AgencyEventEnums.AGENCY_CONSULTANT_ROLE_ADDED,
      aggregate_id: aggregate.getId(),
      data: {
        _id: consultantId,
        name: command.name,
        description: command.description,
        max_consultants: command.max_consultants
      },
      sequence_id: ++eventId
    }, {
      type: AgencyEventEnums.AGENCY_CONSULTANT_ROLE_ENABLED,
      aggregate_id: aggregate.getId(),
      data: {
        _id: consultantId
      },
      sequence_id: ++eventId
    }];
  },
  [AgencyCommandEnums.UPDATE_AGENCY_CONSULTANT_ROLE]: async (aggregate: AgencyAggregate, command: any): Promise<AgencyEvent[]> => {
    let eventId = aggregate.getLastEventId();
    // Should this be one event or many
    // We may want one event per business case
    return [{
      type: AgencyEventEnums.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED,
      aggregate_id: aggregate.getId(),
      data: {...command},
      sequence_id: ++eventId
    }];
  },
  [AgencyCommandEnums.ENABLE_AGENCY_CONSULTANT_ROLE]: async (aggregate: AgencyAggregate, command: any): Promise<AgencyEvent[]> => {
    let eventId = aggregate.getLastEventId();
    if (!aggregate.canEnableConsultantRole(command._id)) {
      return [];
    }
    return [{
      type: AgencyEventEnums.AGENCY_CONSULTANT_ROLE_ENABLED,
      aggregate_id: aggregate.getId(),
      data: {
        _id: command._id
      },
      sequence_id: ++eventId
    }];
  },
  [AgencyCommandEnums.DISABLE_AGENCY_CONSULTANT_ROLE]: async (aggregate: AgencyAggregate, command: any): Promise<AgencyEvent[]> => {
    let eventId = aggregate.getLastEventId();
    if (!aggregate.canDisableConsultantRole(command._id)) {
      return [];
    }
    return [{
      type: AgencyEventEnums.AGENCY_CONSULTANT_ROLE_DISABLED,
      aggregate_id: aggregate.getId(),
      data: {
        _id: command._id
      },
      sequence_id: ++eventId
    }];
  }
};