'use strict';

const {Transform} = require('stream');
const {AgencyClients} = require('../../models');
const {
  AGENCY_CLIENT_LINKED,
  AGENCY_CLIENT_UNLINKED
} = require('../Events');

const events = [
  AGENCY_CLIENT_LINKED, AGENCY_CLIENT_UNLINKED
];

/**
 * Convert an event store entry into the Agency Client Read Projection
 */
class AgencyClientProjection extends Transform {

  constructor(opts = {}) {
    // We only cater for object mode
    opts.objectMode = true;
    super(opts);
  }

  _transform(data, encoding, callback) {
    if (!events.includes(data.event.type)) {
      return callback(null, data);
    }
    const event = data.event;

    if (AGENCY_CLIENT_LINKED === data.event.type) {
      AgencyClients.findOneAndUpdate(
        {
          agency_id: event.aggregate_id.agency_id,
          client_id: event.aggregate_id.client_id,
          organisation_id: event.data.organisation_id
        },
        {
          client_type: event.data.client_type,
          linked: true
        },
        {upsert: true},
        (err) => {
          return callback(err);
        }
      );
    } else if (AGENCY_CLIENT_UNLINKED === data.event.type) {
      AgencyClients.findOneAndUpdate(
        {
          agency_id: event.aggregate_id.agency_id,
          client_id: event.aggregate_id.client_id,
          organisation_id: event.data.organisation_id
        },
        {
          linked: false
        },
        {upsert: true},
        (err) => {
          return callback(err);
        }
      );
    }

    // Should we be adding something here since this is a possible "hanging" issue
  }
}

module.exports = AgencyClientProjection;