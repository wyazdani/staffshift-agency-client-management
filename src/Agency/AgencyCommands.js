'use strict';
const ObjectID = require('mongodb').ObjectID;

const AgencyCommands = {
  'addAgencyConsultantRole': async (aggregate, command) => {
    let eventId = aggregate.getLastEventId();
    return {
      type: 'AgencyConsultantRoleAdded',
      aggregate_id: aggregate.getId(),
      data: {
        _id: (new ObjectID).toString(),
        name: command.name,
        description: command.description,
        max_consultants: command.max_consultants
      },
      sequence_id: ++eventId
    };
  },
  'removeAgencyConsultantRole': async (aggregate, command) => {
    let eventId = aggregate.getLastEventId();
    return {
      type: 'AgencyConsultantRoleRemoved',
      aggregate_id: aggregate.getId(),
      data: {
        _id: command._id
      },
      sequence_id: ++eventId
    };
  }
};

module.exports = AgencyCommands;