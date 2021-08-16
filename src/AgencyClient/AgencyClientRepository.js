'use strict';
const _ = require('lodash');
const agg_projection = require('../AgencyClient/projections/aggregrate');
const {AgencyClientAggregate} = require('./AgencyClientAggregate');
const {AgencyRepository} = require('../Agency/AgencyRepository');

class AgencyClientRepository {

  constructor(store) {
    this._store = store;
  }

  async getAggregate(agency_id, client_id) {
    let events = await this._store.find({aggregate_id: {agency_id, client_id}}).sort({chrono_id: 1}).lean();

    return new AgencyClientAggregate(
      {agency_id, client_id},
      _.reduce(events, event_applier, {last_chrono_id: 0}),
      new AgencyRepository(this._store)
    );
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

module.exports = {AgencyClientRepository};