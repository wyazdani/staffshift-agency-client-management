'use strict';
const _ = require('lodash');

class AgencyConsultantRoleAggregate {

  // Should we rather have all the events here?
  constructor(aggregate) {
    this._aggregate = aggregate;
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

module.exports = {AgencyConsultantRoleAggregate}