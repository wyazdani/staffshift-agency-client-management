'use strict';
const _ = require('lodash');
const agg_projection = require('../AgencyClient/projections/aggregrate');
const {AgencyClientAggregate} = require('../AgencyClient/AgencyClientAggregate');
const aggregate_events = require('./AgencyConsultantRoleEvents');

class AgencyConsultantRoleRepository {

  constructor(store) {
    this._store = store;
  }

  async getAgencyConsultantRole(agency_id) {
    // Using the type here might indicate that we have an aggregate problem
    let events = await this._store.find({'data.agency_id': agency_id, type: {$in: Object.values(aggregate_events)}}).sort({chrono_id: 1}).lean();
    return new AgencyClientAggregate(_.reduce(events, event_applier, {agency_id, last_chrono_id: 0}));
  }

  async save(events) {
    console.log(events);
    // Does not belong here
    await this._store.insertMany(events, {lean: true});
  }

}

const event_applier = (aggregate, event) => {
  return agg_projection[event.type](aggregate, event);
}

module.exports = {AgencyConsultantRoleRepository};