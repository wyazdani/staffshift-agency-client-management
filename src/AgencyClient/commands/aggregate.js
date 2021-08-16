'use strict';
const _ = require('lodash');
const ObjectID = require('mongodb').ObjectID;

const projections = {
  'addClientConsultant': async (aggregate, command) => {
    aggregate.addClientConsultant(command);
    let event_id = aggregate.getLastEventId();
    console.log('addClientConsultant');
    return {
      type: 'ClientConsultantAdded',
      aggregate_id: aggregate.getId(),
      data: {
        _id: (new ObjectID).toString(),
        consultant_type: command.consultant_type,
        consultant_id: command.consultant_id
      },
      chrono_id: ++event_id
    }
  },
  'removeClientConsultant': async (aggregate, command) => {
    aggregate.removeClientConsultant(command);
    let event_id = aggregate.getLastEventId();
    console.log('removeClientConsultant');
    return {
      type: 'ClientConsultantRemoved',
      aggregate_id: aggregate.getId(),
      data: {
        _id: command._id
      },
      chrono_id: ++event_id
    }
  }
}

module.exports = projections