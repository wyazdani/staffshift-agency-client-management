'use strict';
const _ = require('lodash');

const projections = {
  'AgencyConsultantRoleAdded': (aggregate, event) => {
    console.log('AgencyConsultantRoleAdded');
    let consultant_role = {};
    consultant_role._id = event.data._id;
    consultant_role.name = event.data.name;
    consultant_role.description = event.data.description;
    consultant_role.max_consultants = event.data.max_consultants;
    (aggregate.consultant_roles) ?
      aggregate.consultant_roles.push(consultant_role) :
      aggregate.consultant_roles = [consultant_role];
    return {...aggregate, last_sequence_id: event.sequence_id};
  },
  'AgencyConsultantRoleRemoved': (aggregate, event) => {
    console.log('AgencyConsultantRoleRemoved');
    aggregate.consultant_roles = _.differenceWith(aggregate.consultant_roles, [event.data], function(value, other) {
      return ((value._id == other._id))
    });
    return {...aggregate, last_sequence_id: event.sequence_id};
  }
}

module.exports = projections