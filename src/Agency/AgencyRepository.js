'use strict';
const _ = require('lodash');
const aggregateProjection = require('./AgencyWriteProjection');
const {AgencyAggregate} = require('./AgencyAggregate');

class AgencyRepository {

  constructor(store) {
    this._store = store;
  }

  async getAggregate(agencyId, sequenceId = undefined) {
    let query = {aggregate_id: {agency_id: agencyId}};
    if (sequenceId) {
      query['sequence_id'] = {$lte: sequenceId};
    }
    let events = await this._store.find(query).sort({sequence_id: 1}).lean();
    return new AgencyAggregate(
      {agency_id: agencyId},
      _.reduce(events, eventApplier, {last_sequence_id: 0})
    );
  }

  async save(events) {
    return this._store.insertMany(events, {lean: true});
  }
}

const eventApplier = (aggregate, event) => {
  return aggregateProjection[event.type](aggregate, event);
};

module.exports = {AgencyRepository};