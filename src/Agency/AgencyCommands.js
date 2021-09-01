'use strict';
const ObjectID = require('mongodb').ObjectID;

const AgencyCommands = {
  'addAgencyConsultantRole': async (aggregate, command) => {
    let eventId = aggregate.getLastEventId();
    // We are looking to auto enabled a newly created consultant roles
    let consultantId = (new ObjectID).toString();
    return [{
      type: 'AgencyConsultantRoleAdded',
      aggregate_id: aggregate.getId(),
      data: {
        _id: consultantId,
        name: command.name,
        description: command.description,
        max_consultants: command.max_consultants
      },
      sequence_id: ++eventId
    }, {
      type: 'AgencyConsultantRoleEnabled',
      aggregate_id: aggregate.getId(),
      data: {
        _id: consultantId
      },
      sequence_id: ++eventId
    }];
  },
  'enableAgencyConsultantRole': async (aggregate, command) => {
    let eventId = aggregate.getLastEventId();
    if (!aggregate.canEnableConsultantRole(command._id)) {
      return [];
    }
    return {
      type: 'AgencyConsultantRoleEnabled',
      aggregate_id: aggregate.getId(),
      data: {
        _id: command._id
      },
      sequence_id: ++eventId
    };
  },
  'disableAgencyConsultantRole': async (aggregate, command) => {
    let eventId = aggregate.getLastEventId();
    if (!aggregate.canDisableConsultantRole(command._id)) {
      return [];
    }
    return {
      type: 'AgencyConsultantRoleDisabled',
      aggregate_id: aggregate.getId(),
      data: {
        _id: command._id
      },
      sequence_id: ++eventId
    };
  }
};

module.exports = AgencyCommands;