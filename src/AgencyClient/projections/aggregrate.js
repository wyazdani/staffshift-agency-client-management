'use strict';
const _ = require('lodash');
const {
  AGENCY_CLIENT_LINKED,
  AGENCY_CLIENT_UNLINKED,
  AGENCY_CLIENT_CONSULTANT_ASSIGNED,
  AGENCY_CLIENT_CONSULTANT_UNASSIGNED
} = require('../../Events');

const projections = {
  [AGENCY_CLIENT_LINKED]: (aggregate, event) => {
    aggregate.linked = true;
    aggregate.client_type = event.data.client_type;
    return {...aggregate, last_sequence_id: event.sequence_id};
  },
  [AGENCY_CLIENT_UNLINKED]: (aggregate, event) => {
    aggregate.linked = false;
    return {...aggregate, last_sequence_id: event.sequence_id};
  },
  [AGENCY_CLIENT_CONSULTANT_ASSIGNED]: (aggregate, event) => {
    let consultant = {};
    consultant._id = event.data._id;
    consultant.consultant_role_id = event.data.consultant_role_id;
    consultant.consultant_id = event.data.consultant_id;
    (aggregate.consultants) ?
      aggregate.consultants.push(consultant) :
      aggregate.consultants = [consultant];
    return {...aggregate, last_sequence_id: event.sequence_id};
  },
  [AGENCY_CLIENT_CONSULTANT_UNASSIGNED]: (aggregate, event) => {
    aggregate.consultants = _.differenceWith(aggregate.consultants, [event.data], function agencyClientConsultantRemove(value, other) {
      return ((value._id == other._id));
    });
    return {...aggregate, last_sequence_id: event.sequence_id};
  }
};

module.exports = projections;