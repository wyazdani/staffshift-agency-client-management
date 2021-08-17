'use strict';
const _ = require('lodash');
const {
  AGENCY_CLIENT_LINK_CREATED,
  AGENCY_CLIENT_UNLINKED,
  AGENCY_CLIENT_CONSULTANT_ADDED,
  AGENCY_CLIENT_CONSULTANT_REMOVED
} = require('../../Events');

const projections = {
  [AGENCY_CLIENT_LINK_CREATED]: (aggregate, event) => {
    return {...event.data, last_sequence_id: event.sequence_id};
  },
  [AGENCY_CLIENT_UNLINKED]: (aggregate, event) => {
    aggregate.linked = false
    return {...aggregate, last_sequence_id: event.sequence_id};
  },
  [AGENCY_CLIENT_CONSULTANT_ADDED]: (aggregate, event) => {
    let consultant = {};
    consultant._id = event.data._id;
    consultant.consultant_role_id = event.data.consultant_role_id;
    consultant.consultant_id = event.data.consultant_id;
    (aggregate.consultants) ?
      aggregate.consultants.push(consultant) :
      aggregate.consultants = [consultant];
    return {...aggregate, last_sequence_id: event.sequence_id};
  },
  [AGENCY_CLIENT_CONSULTANT_REMOVED]: (aggregate, event) => {
    aggregate.consultants = _.differenceWith(aggregate.consultants, [event.data], function(value, other) {
      return ((value._id == other._id))
    });
    return {...aggregate, last_sequence_id: event.sequence_id};
  }
}

module.exports = projections