'use strict';
const _ = require('lodash');
const agg_projection = require('../AgencyClient/projections/aggregrate');
const {AgencyClientAggregate} = require('./AgencyClientAggregate');

class AgencyClientRepository {

  constructor(store) {
    this._store = store;
  }

  async getAgencyClient(agency_id, client_id) {
    let events = await this._store.find({'data.agency_id': agency_id, 'data.client_id': client_id}).sort({chrono_id: 1}).lean();
    return new AgencyClientAggregate(_.reduce(events, event_applier, {}));
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