'use strict';

const {Transform} = require('stream');
const {
  AGENCY_CLIENT_LINKED,
  AGENCY_CLIENT_UNLINKED
} = require('../../../src/Events');

const events = [
  AGENCY_CLIENT_LINKED, AGENCY_CLIENT_UNLINKED
];

/**
 * Convert an event store entry into the Agency Client Read Projection
 */
class AgencyClientsProjectionTransformer extends Transform {

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
    let criteria = {
      agency_id: event.aggregate_id.agency_id,
      client_id: event.aggregate_id.client_id
    };
    if (event.data.organisation_id) {
      criteria.organisation_id = event.data.organisation_id;
    }
    if (event.data.site_id) {
      criteria.site_id = event.data.site_id;
    }
    if (AGENCY_CLIENT_LINKED === data.event.type) {
      this.model.findOneAndUpdate(
        criteria,
        {
          client_type: event.data.client_type,
          linked: true
        },
        {upsert: true},
        (err) => {
          return callback(err, data);
        }
      );
    } else if (AGENCY_CLIENT_UNLINKED === data.event.type) {
      this.model.findOneAndUpdate(
        criteria,
        {
          client_type: event.data.client_type,
          linked: false
        },
        {upsert: true},
        (err) => {
          return callback(err, data);
        }
      );
    }
    // Should we be adding something here since this is a possible "hanging" issue
  }
}

module.exports = AgencyClientsProjectionTransformer;