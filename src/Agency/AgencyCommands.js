'use strict';
const ObjectID = require('mongodb').ObjectID;
const {
  ADD_AGENCY_CONSULTANT_ROLE,
  UPDATE_AGENCY_CONSULTANT_ROLE,
  ENABLE_AGENCY_CONSULTANT_ROLE,
  DISABLE_AGENCY_CONSULTANT_ROLE
} = require('./enums/AgencyCommandEnums');
const {
  AGENCY_CONSULTANT_ROLE_ADDED,
  AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED,
  AGENCY_CONSULTANT_ROLE_ENABLED,
  AGENCY_CONSULTANT_ROLE_DISABLED
} = require('./enums/AgencyEventEnums');

const AgencyCommands = {
  [ADD_AGENCY_CONSULTANT_ROLE]: async (aggregate, command) => {
    let eventId = aggregate.getLastEventId();
    // We are looking to auto enabled a newly created consultant roles
    let consultantId = (new ObjectID).toString();
    return [{
      type: AGENCY_CONSULTANT_ROLE_ADDED,
      aggregate_id: aggregate.getId(),
      data: {
        _id: consultantId,
        name: command.name,
        description: command.description,
        max_consultants: command.max_consultants
      },
      sequence_id: ++eventId
    }, {
      type: AGENCY_CONSULTANT_ROLE_ENABLED,
      aggregate_id: aggregate.getId(),
      data: {
        _id: consultantId
      },
      sequence_id: ++eventId
    }];
  },
  [UPDATE_AGENCY_CONSULTANT_ROLE]: async (aggregate, command) => {
    let eventId = aggregate.getLastEventId();
    // Should this be one event or many
    // We may want one event per business case
    return {
      type: AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED,
      aggregate_id: aggregate.getId(),
      data: {...command},
      sequence_id: ++eventId
    };
  },
  [ENABLE_AGENCY_CONSULTANT_ROLE]: async (aggregate, command) => {
    let eventId = aggregate.getLastEventId();
    if (!aggregate.canEnableConsultantRole(command._id)) {
      return [];
    }
    return {
      type: AGENCY_CONSULTANT_ROLE_ENABLED,
      aggregate_id: aggregate.getId(),
      data: {
        _id: command._id
      },
      sequence_id: ++eventId
    };
  },
  [DISABLE_AGENCY_CONSULTANT_ROLE]: async (aggregate, command) => {
    let eventId = aggregate.getLastEventId();
    if (!aggregate.canDisableConsultantRole(command._id)) {
      return [];
    }
    return {
      type: AGENCY_CONSULTANT_ROLE_DISABLED,
      aggregate_id: aggregate.getId(),
      data: {
        _id: command._id
      },
      sequence_id: ++eventId
    };
  }
};

module.exports = AgencyCommands;