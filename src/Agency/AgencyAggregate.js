'use strict';
const _ = require('lodash');

class AgencyAggregate {

  // Should we rather have all the events here?
  constructor(id, aggregate) {
    this._id = id;
    this._aggregate = aggregate;
  }

  getMaxAllowedConsultants(consultantRoleId) {
    const role = _.find(this._aggregate.consultant_roles, {_id: consultantRoleId});
    return (role) ? role.max_consultants : 0;
  }

  getConsultantRole(consultantRoleId) {
    return _.find(this._aggregate.consultant_roles, {_id: consultantRoleId});
  }

  getConsultantRoles() {
    return this._aggregate.consultant_roles;
  }

  canEnableConsultantRole(consultantRoleId) {
    let role =  _.find(this._aggregate.consultant_roles, {_id: consultantRoleId});
    if (!role) {
      throw new Error('BOOM, THERE IS NO MATCHING ROLE');
    }
    return role.status !== 'enabled';
  }

  canDisableConsultantRole(consultantRoleId) {
    let role =  _.find(this._aggregate.consultant_roles, {_id: consultantRoleId});
    if (!role) {
      throw new Error('BOOM, THERE IS NO MATCHING ROLE');
    }
    return role.status !== 'disabled';
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

module.exports = {AgencyAggregate};