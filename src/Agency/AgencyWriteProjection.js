'use strict';
const _ = require('lodash');
const {
  AGENCY_CONSULTANT_ROLE_ADDED,
  AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED,
  AGENCY_CONSULTANT_ROLE_ENABLED,
  AGENCY_CONSULTANT_ROLE_DISABLED
} = require('../Events');

const projections = {
  [AGENCY_CONSULTANT_ROLE_ADDED]: (aggregate, event) => {
    let consultantRole = {};
    consultantRole._id = event.data._id;
    consultantRole.name = event.data.name;
    consultantRole.description = event.data.description;
    consultantRole.max_consultants = event.data.max_consultants;
    (aggregate.consultant_roles) ?
      aggregate.consultant_roles.push(consultantRole) :
      aggregate.consultant_roles = [consultantRole];
    return {...aggregate, last_sequence_id: event.sequence_id};
  },
  [AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED]: (aggregate, event) => {
    aggregate.consultant_roles = _.map(aggregate.consultant_roles, (item) => {
      if (item._id == event.data._id) {
        return {...item, ...event.data};
      }
      return item;
    });
    return {...aggregate, last_sequence_id: event.sequence_id};
  },
  [AGENCY_CONSULTANT_ROLE_ENABLED]: (aggregate, event) => {
    aggregate.consultant_roles = _.map(aggregate.consultant_roles, (item) => {
      if (item._id == event.data._id) {
        return {...item, status: 'enabled'};
      }
      return item;
    });
    return {...aggregate, last_sequence_id: event.sequence_id};
  },
  [AGENCY_CONSULTANT_ROLE_DISABLED]: (aggregate, event) => {
    aggregate.consultant_roles = _.map(aggregate.consultant_roles, (item) => {
      if (item._id == event.data._id) {
        return {...item, status: 'disabled'};
      }
      return item;
    });
    return {...aggregate, last_sequence_id: event.sequence_id};
  }
};

module.exports = projections;