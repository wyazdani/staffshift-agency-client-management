'use strict';
const _ = require('lodash');
const ObjectID = require('mongodb').ObjectID;

const AgencyCommands = {
  'addAgencyConsultantRole': async (aggregate, command) => {
    let event_id = aggregate.getLastEventId();
    return {
      type: 'AgencyConsultantRoleAdded',
      aggregate_id: aggregate.getId(),
      data: {
        _id: (new ObjectID).toString(),
        name: command.name,
        description: command.description,
        max_consultants: command.max_consultants
      },
      sequence_id: ++event_id
    }
  },
  'removeAgencyConsultantRole': async (aggregate, command) => {
    let event_id = aggregate.getLastEventId();
    return {
      type: 'AgencyConsultantRoleRemoved',
      aggregate_id: aggregate.getId(),
      data: {
        _id: command._id
      },
      sequence_id: ++event_id
    }
  }
}

module.exports = AgencyCommands