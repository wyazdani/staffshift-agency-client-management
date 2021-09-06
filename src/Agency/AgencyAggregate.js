'use strict';
const _ = require('lodash');
const {
  AGENCY_CONSULTANT_ROLE_STATUS_ENABLED,
  AGENCY_CONSULTANT_ROLE_STATUS_DISABLED
} = require('./enums/AgencyConsultantRoleEnums');

class AgencyAggregate {

  // Should we rather have all the events here?
  constructor(id, aggregate) {
    this._id = id;
    this._aggregate = aggregate;
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
    return role.status !== AGENCY_CONSULTANT_ROLE_STATUS_ENABLED;
  }

  canDisableConsultantRole(consultantRoleId) {
    let role =  _.find(this._aggregate.consultant_roles, {_id: consultantRoleId});
    if (!role) {
      throw new Error('BOOM, THERE IS NO MATCHING ROLE');
    }
    return role.status !== AGENCY_CONSULTANT_ROLE_STATUS_DISABLED;
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