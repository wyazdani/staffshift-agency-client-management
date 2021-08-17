'use strict';
const _ = require('lodash');
const ObjectID = require('mongodb').ObjectID;

const projections = {
  'addAgencyClientConsultant': async (aggregate, command) => {
    await aggregate.addClientConsultant(command);
    let event_id = aggregate.getLastEventId();
    return {
      type: 'AgencyClientConsultantAdded',
      aggregate_id: aggregate.getId(),
      data: {
        _id: (new ObjectID).toString(),
        consultant_role_id: command.consultant_role_id,
        consultant_id: command.consultant_id
      },
      sequence_id: ++event_id
    }
  },
  'removeAgencyClientConsultant': async (aggregate, command) => {
    await aggregate.removeClientConsultant(command);
    let event_id = aggregate.getLastEventId();
    return {
      type: 'AgencyClientConsultantRemoved',
      aggregate_id: aggregate.getId(),
      data: {
        _id: command._id
      },
      sequence_id: ++event_id
    }
  }
}

module.exports = projections