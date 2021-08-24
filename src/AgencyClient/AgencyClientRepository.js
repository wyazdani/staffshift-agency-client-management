'use strict';
const _ = require('lodash');
const aggregateProjection = require('../AgencyClient/projections/aggregrate');
const {AgencyClientAggregate} = require('./AgencyClientAggregate');
const {AgencyRepository} = require('../Agency/AgencyRepository');

class AgencyClientRepository {

  constructor(store) {
    this._store = store;
  }

  async getAggregate(agency_id, client_id, sequence_id = undefined) {
    let query = {aggregate_id: {agency_id, client_id}};
    if (sequence_id) {
      query['sequence_id'] = {$lte: sequence_id};
    }
    let events = await this._store.find(query).sort({sequence_id: 1}).lean();

    return new AgencyClientAggregate(
      {agency_id, client_id},
      _.reduce(events, eventApplier, {last_sequence_id: 0}),
      new AgencyRepository(this._store)
    );
  }

  async save(events) {
    await this._store.insertMany(events, {lean: true});
  }

}

const eventApplier = (aggregate, event) => {
  return aggregateProjection[event.type](aggregate, event);
}

module.exports = {AgencyClientRepository};