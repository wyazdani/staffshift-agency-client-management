'use strict';
const _ = require('lodash');
const ObjectID = require('mongodb').ObjectID;

const AgencyCommands = {
  'addAgencyConsultantRole': async (aggregate, command) => {
    let event_id = aggregate.getLastEventId();
    console.log('addAgencyConsultantRole');
    return {
      type: 'AgencyConsultantRoleAdded',
      aggregate_id: aggregate.getId(),
      data: {
        _id: (new ObjectID).toString(),
        name: command.name,
        description: command.description,
        max_consultants: command.max_consultants
      },
      chrono_id: ++event_id
    }
  },
  'removeAgencyConsultantRole': async (aggregate, command) => {
    let event_id = aggregate.getLastEventId();
    console.log('removeAgencyConsultantRole');
    return {
      type: 'AgencyConsultantRoleRemoved',
      aggregate_id: aggregate.getId(),
      data: {
        _id: command._id
      },
      chrono_id: ++event_id
    }
  }
}

module.exports = AgencyCommands