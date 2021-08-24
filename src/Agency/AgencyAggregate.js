'use strict';
const _ = require('lodash');

class AgencyAggregate {

  // Should we rather have all the events here?
  constructor(id, aggregate) {
    this._id = id;
    this._aggregate = aggregate;
  }

  getMaxAllowedConsultants(consultant_role_id) {
    const role = _.find(this._aggregate.consultant_roles, {_id: consultant_role_id});
    return (role) ? role.max_consultants : 0;
  }

  getConsultantRole(consultant_role_id) {
    return _.find(this._aggregate.consultant_roles, {_id: consultant_role_id});
  }

  getId() {
    return this._id;
  }

  getLastEventId() {
    return this._aggregate.last_sequence_id;
  }

  // Base class method for all aggregates
  toJSON() {
    return this._aggregate;
  }
}

module.exports = {AgencyAggregate}