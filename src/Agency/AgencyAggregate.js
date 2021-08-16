'use strict';
const _ = require('lodash');

class AgencyAggregate {

  // Should we rather have all the events here?
  constructor(id, aggregate) {
    this._id = id;
    this._aggregate = aggregate;
  }

  getId() {
    return this._id;
  }

  getLastEventId() {
    return this._aggregate.last_chrono_id;
  }

  // Base class method for all aggregates
  toJSON() {
    return this._aggregate;
  }
}

module.exports = {AgencyAggregate}