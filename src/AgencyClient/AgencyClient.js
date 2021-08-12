'use strict';
const _ = require('lodash');
const agg_projection = require('../AgencyClient/projections/aggregrate');
const cmds = require('../AgencyClient/commands/aggregate');

class AgencyClient {
  constructor(agency_id, client_id) {
    this.agency_id = agency_id;
    this.client_id = client_id;
  }

  setEventStore(store) {
    this.store = store;
  }

  async apply(command) {
    if (!this.projection) {
      this.project();
    }
    let events = await this.store.find({'data.agency_id': this.agency_id, 'data.client_id': this.client_id}).sort({chrono_id: 1}).lean();
    this.projection = _.reduce(events, event_applier, {});


    if (!cmds[command.type]) {
      throw new Error(`Command type:${command.type} is not supported`);
    }
    let new_events = await cmds[command.type](this, command.data, this.projection.last_chrono_id || 0);

    // Does not belong here
    await this.store.insertMany(new_events, {lean: true});
  }

  addClientConsultant(consultant) {
    // Only a single portfolio consultant allowed
    if (
        consultant.consultant_type == 'portfolio' &&
        _.find(this.projection.consultants, {consultant_type: 'portfolio'}) !== undefined
    ) {
      throw new Error('TOO MANY PORTFOLIO CONSULTANTS');
    }
  }

  removeClientConsultant(consultant) {
    // prevent us from deleting something that does not exist
    if (_.find(this.projection.consultants, {_id: consultant._id}) === undefined) {
      throw new Error('CONSULTANT NOT FOUND');
    }
  }

  async project() {
    let events = await this.store.find({'data.agency_id': this.agency_id, 'data.client_id': this.client_id}).sort({chrono_id: 1}).lean();
    return _.reduce(events, event_applier, {});
  }
}

const event_applier = (aggregate, event) => {
  return agg_projection[event.type](aggregate, event);
}

module.exports = AgencyClient