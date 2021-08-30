'use strict';

const {Transform} = require('stream');
const {AgencyClientConsultants, EventStore} = require('../../models');
const {AgencyRepository} = require('../../src/Agency/AgencyRepository');
const {
  AGENCY_CLIENT_CONSULTANT_ADDED,
  AGENCY_CLIENT_CONSULTANT_REMOVED
} = require('../Events');

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
  }

  _transform(data, encoding, callback) {
    if (!events.includes(data.event.type)) {
      return callback(null, data);
    }
    const event = data.event;
    if (AGENCY_CLIENT_CONSULTANT_ADDED === data.event.type) {
      // if the UI does the legend stitching we dont do this work
      // NOR do we care about any updates to the actual name
      let repository = new AgencyRepository(EventStore);
      repository.getAggregate(event.aggregate_id.agency_id)
        .then((agencyAggregate) => {
          let role = agencyAggregate.getConsultantRole(event.data.consultant_role_id);
          const agencyClientConsultant = new AgencyClientConsultants({
            _id: event.data._id,
            agency_id: event.aggregate_id.agency_id,
            client_id: event.aggregate_id.client_id,
            consultant_role_id: event.data.consultant_role_id,
            consultant_role_name: role.name,
            consultant_id: event.data.consultant_id
          });
          agencyClientConsultant.save((err) => {
            if (err) {
              return callback(err);
            }
            return callback(null, data);
          });
        })
        .catch((err) => {
          return callback(err);
        });
    } else if (AGENCY_CLIENT_CONSULTANT_REMOVED === data.event.type) {
      AgencyClientConsultants.remove({_id: event.data._id}, (err) => {
        if (err) {
          return callback(err);
        }
        return callback(null, data);
      });
    }
    // Should we be adding something here since this is a possible "hanging" issue
  }
}

module.exports = AgencyClientConsultantProjection;