'use strict';

const {Transform} = require('stream');
const {AgencyRepository} = require('../../../src/Agency/AgencyRepository');
const {
  AGENCY_CLIENT_CONSULTANT_ADDED,
  AGENCY_CLIENT_CONSULTANT_REMOVED
} = require('../../../src/Events');

const events = [
  AGENCY_CLIENT_CONSULTANT_ADDED, AGENCY_CLIENT_CONSULTANT_REMOVED
];

/**
 * Convert a standard delta change stream event into an upsert structure that can be used
 */
class AgencyClientConsultantProjection extends Transform {

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
    if (AGENCY_CLIENT_CONSULTANT_ADDED === data.event.type) {
      // if the UI does the legend stitching we dont do this work
      // NOR do we care about any updates to the actual name
      let repository = new AgencyRepository(this.eventstore);
      repository.getAggregate(event.aggregate_id.agency_id)
        .then((agencyAggregate) => {
          let role = agencyAggregate.getConsultantRole(event.data.consultant_role_id);
          const agencyClientConsultant = new this.model({
            _id: event.data._id,
            agency_id: event.aggregate_id.agency_id,
            client_id: event.aggregate_id.client_id,
            consultant_role_id: event.data.consultant_role_id,
            consultant_role_name: role.name,
            consultant_id: event.data.consultant_id
          });
          agencyClientConsultant.save((err) => {
            return callback(err, data);
          });
        })
        .catch((err) => {
          return callback(err);
        });
    } else if (AGENCY_CLIENT_CONSULTANT_REMOVED === data.event.type) {
      this.model.remove({_id: event.data._id}, (err) => {
        return callback(err, data);
      });
    }
    // Should we be adding something here since this is a possible "hanging" issue
  }
}

module.exports = AgencyClientConsultantProjection;