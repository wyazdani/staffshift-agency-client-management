'use strict';
const _ = require('lodash');

class AgencyClientAggregate {

  // Should we rather have all the events here?
  constructor(id, aggregate) {
    this._id = id;
    this._aggregate = aggregate;
  }

  // Business Logic that should be applied
  addClientConsultant(consultant) {
    // Only a single portfolio consultant allowed
    if (
        consultant.consultant_type == 'portfolio' &&
        _.find(this._aggregate.consultants, {consultant_type: 'portfolio'}) !== undefined
    ) {
      throw new Error('TOO MANY PORTFOLIO CONSULTANTS');
    }
  }

  removeClientConsultant(consultant) {
    // prevent us from deleting something that does not exist
    if (_.find(this._aggregate.consultants, {_id: consultant._id}) === undefined) {
      throw new Error('CONSULTANT NOT FOUND');
    }
  }

  getId() {
    return this._id;
  }

  // This method does not seem correct
  getClientId() {
    return this._aggregate.client_id;
  }

  // This method does not seem correct
  getAgencyId() {
    return this._aggregate.agency_id;
  }

  getLastEventId() {
    return this._aggregate.last_chrono_id;
  }

  // Base class method for all aggregates
  toJSON() {
    return this._aggregate;
  }
}

module.exports = {AgencyClientAggregate}