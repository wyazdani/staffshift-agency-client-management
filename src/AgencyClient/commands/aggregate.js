'use strict';
const _ = require('lodash');
const ObjectID = require('mongodb').ObjectID;

const projections = {
  'addClientConsultant': async (aggregate, command, chrono_id) => {
    aggregate.addClientConsultant(command);
    console.log('addClientConsultant');
    return {
      type: 'ClientConsultantAdded',
      data: {
        _id: (new ObjectID).toString(),
        agency_id: aggregate.agency_id,
        client_id: aggregate.client_id,
        consultant_type: command.consultant_type,
        consultant_id: command.consultant_id
      },
      chrono_id: ++chrono_id
    }
  },
  'removeClientConsultant': async (aggregate, command, chrono_id) => {
    aggregate.removeClientConsultant(command);
    console.log('removeClientConsultant');
    return {
      type: 'ClientConsultantRemoved',
      data: {
        _id: command._id,
        agency_id: aggregate.agency_id,
        client_id: aggregate.client_id
      },
      chrono_id: ++chrono_id
    }
  }
}

module.exports = projections