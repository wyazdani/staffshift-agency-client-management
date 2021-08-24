'use strict';

const {Transform} = require('stream');
const _ = require('lodash');
const {AgencyClientEventLog, EventStore} = require('../../models');
const {AgencyClientRepository} = require('../AgencyClient/AgencyClientRepository');
const {
  AGENCY_CLIENT_CONSULTANT_ADDED,
  AGENCY_CLIENT_CONSULTANT_REMOVED
} = require('../Events');

const events = [
  AGENCY_CLIENT_CONSULTANT_ADDED, AGENCY_CLIENT_CONSULTANT_REMOVED
]

/**
 * Convert a standard delta change stream event into an upsert structure that can be used
 */
class AgencyClientEventLogProjection extends Transform {

  constructor(opts = {}) {
    // We only cater for object mode
    opts.objectMode = true;
    super(opts);
  }

  _transform(data, encoding, callback) {
    if (!events.includes(data.event.type)) {
      console.log('SKIPPING THINGS HERE NOW');
      return callback(null, data);
    }
    console.log(data);
    const event = data.event;

    let repository = new AgencyClientRepository(EventStore);
    repository.getAggregate(event.aggregate_id.agency_id, event.aggregate_id.client_id, event.sequence_id)
      .then((aggregate) => {
        const agencyClientEvent = new AgencyClientEventLog({
          agency_id: event.aggregate_id.agency_id,
          client_id: event.aggregate_id.client_id,
          event: event.type,
          evented_at: event.created_at,
          snapshot: aggregate.getConsultants()
        })
        agencyClientEvent.save((err) => {
          if (err) {
            console.log(err);
            return callback(err);
          }
          console.log('ADD COMPLETED');
          return callback(null, data);
        })
      }).catch((err) => {
        return callback(err);
      });
    // Should we be adding something here since this is a possible "hanging" issue
  }
}

module.exports = AgencyClientEventLogProjection;