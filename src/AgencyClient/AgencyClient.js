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
    let events = await this.store.find({'data.agency_id': this.agency_id, 'data.client_id': this.client_id}).sort({chrono_id: 1}).lean();
    this.projection = _.reduce(events, event_applier, {});
    console.log('events and projection complete');

    if (!cmds[command.type]) {
      throw new Error(`Command type:${command.type} is not supported`);
    }
    let new_events = await cmds[command.type](this, command.data, this.projection.last_chrono_id || 0);

    // Does not belong here
    await this.store.insertMany(new_events, {lean: true});
  }

  assignClientConsultant(consultant) {
    // Only a single portfolio consultant allowed
    if (
        consultant.consultant_type == 'portfolio' &&
        _.find(this.projection.consultants, {consultant_type: 'portfolio'}) !== undefined
    ) {
      throw new Error('TOO MANY PORTFOLIO CONSULTANTS');
    }
  }
}

const event_applier = (aggregate, event) => {
  return agg_projection[event.type](aggregate, event);
}

module.exports = AgencyClient