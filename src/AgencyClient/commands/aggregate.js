'use strict';
const _ = require('lodash');
const ObjectID = require('mongodb').ObjectID;

const projections = {
  'assignClientConsultant': async (aggregate, command, chrono_id) => {
    aggregate.assignClientConsultant(command);
    console.log('assignClientConsultant');
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
  }
}

module.exports = projections