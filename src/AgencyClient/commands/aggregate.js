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
      data: {
        _id: (new ObjectID).toString(),
        agency_id: aggregate.getAgencyId(),
        client_id: aggregate.getClientId(),
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
      data: {
        _id: command._id,
        agency_id: aggregate.getAgencyId(),
        client_id: aggregate.getClientId()
      },
      chrono_id: ++event_id
    }
  }
}

module.exports = projections