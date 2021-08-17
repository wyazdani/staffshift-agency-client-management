'use strict';
const _ = require('lodash');

const projections = {
  'AgencyClientLinkCreated': (aggregate, event) => {
    return {...event.data, last_sequence_id: event.sequence_id};
  },
  'AgencyClientUnLinked': (aggregate, event) => {
    aggregate.linked = false
    return {...aggregate, last_sequence_id: event.sequence_id};
  },
  'AgencyClientConsultantAdded': (aggregate, event) => {
    let consultant = {};
    consultant._id = event.data._id;
    consultant.consultant_role_id = event.data.consultant_role_id;
    consultant.consultant_id = event.data.consultant_id;
    (aggregate.consultants) ?
      aggregate.consultants.push(consultant) :
      aggregate.consultants = [consultant];
    return {...aggregate, last_sequence_id: event.sequence_id};
  },
  'AgencyClientConsultantRemoved': (aggregate, event) => {
    aggregate.consultants = _.differenceWith(aggregate.consultants, [event.data], function(value, other) {
      return ((value._id == other._id))
    });
    return {...aggregate, last_sequence_id: event.sequence_id};
  }
}

module.exports = projections