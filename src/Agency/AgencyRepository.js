'use strict';
const _ = require('lodash');
const agg_projection = require('./AgencyWriteProjection');
const {AgencyAggregate} = require('./AgencyAggregate');

class AgencyRepository {

  constructor(store) {
    this._store = store;
  }

  async getAggregate(agency_id) {
    let events = await this._store.find({aggregate_id: {agency_id}}).sort({sequence_id: 1}).lean();
    return new AgencyAggregate(
      {agency_id},
      _.reduce(events, event_applier, {last_sequence_id: 0})
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

module.exports = {AgencyRepository};