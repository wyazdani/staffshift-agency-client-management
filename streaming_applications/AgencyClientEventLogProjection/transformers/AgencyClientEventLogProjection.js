'use strict';

const {Transform} = require('stream');
const {AgencyClientRepository} = require('../../../src/AgencyClient/AgencyClientRepository');
const {
  AGENCY_CLIENT_CONSULTANT_ASSIGNED,
  AGENCY_CLIENT_CONSULTANT_UNASSIGNED
} = require('../../../src/Events');

const events = [
  AGENCY_CLIENT_CONSULTANT_ASSIGNED, AGENCY_CLIENT_CONSULTANT_UNASSIGNED
];

/**
 * Convert a standard delta change stream event into an upsert structure that can be used
 */
class AgencyClientEventLogProjection extends Transform {

  constructor(opts = {}) {
    // We only cater for object mode
    opts.objectMode = true;
    super(opts);
    this.eventstore = opts.eventstore;
    this.model = opts.model;
    this.pipeline = opts.pipeline;
    this.logger = opts.logger;
  }

  _transform(data, encoding, callback) {
    if (!events.includes(data.event.type)) {
      return callback(null, data);
    }
    const event = data.event;
    let repository = new AgencyClientRepository(this.eventstore);
    repository.getAggregate(event.aggregate_id.agency_id, event.aggregate_id.client_id, event.sequence_id)
      .then((aggregate) => {
        const agencyClientEvent = new this.model({
          agency_id: event.aggregate_id.agency_id,
          client_id: event.aggregate_id.client_id,
          event: event.type,
          evented_at: event.created_at,
          snapshot: aggregate.getConsultants()
        });
        agencyClientEvent.save((err) => {
          if (err) {
            return callback(err);
          }
          return callback(null, data);
        });
      }).catch((err) => {
        return callback(err);
      });
    // Should we be adding something here since this is a possible "hanging" issue
  }
}

module.exports = AgencyClientEventLogProjection;