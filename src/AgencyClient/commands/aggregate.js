'use strict';
const _ = require('lodash');
const ObjectID = require('mongodb').ObjectID;

const projections = {
  // CMD coming from a Triage Domain Event
  'linkAgencyClient': async (aggregate, command) => {
    const isLinked = aggregate.isLinked();
    if (!isLinked) {
      let event_id = aggregate.getLastEventId();
      return {
        type: 'AgencyClientLinked',
        aggregate_id: aggregate.getId(),
        data: {
          organisation_id: command.organisation_id,
          client_type: command.client_type
        },
        sequence_id: ++event_id
      }
    }
    // If we are already linked there is no need to create another link event
    return [];
  },
  // CMD coming from a Triage Domain Event
  'unlinkAgencyClient': async (aggregate, command) => {
    const isLinked = aggregate.isLinked();
    // If linked OR this is the first time we are dealing with this aggregate
    if (isLinked || aggregate.getLastEventId() == 0) {
      let event_id = aggregate.getLastEventId();
      return {
        type: 'AgencyClientUnLinked',
        aggregate_id: aggregate.getId(),
        data: {
          organisation_id: command.organisation_id
        },
        sequence_id: ++event_id
      }
    }
    // If we are not linked there is no need to create another unlink event
    return [];
  },
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