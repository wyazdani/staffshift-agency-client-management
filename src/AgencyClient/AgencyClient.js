'use strict';
const _ = require('lodash');
const agg_projection = require('../AgencyClient/projections/aggregrate');

class AgencyClient {
  constructor(agency_id, client_id) {
    this.agency_id = agency_id;
    this.client_id = client_id;
  }

  setEventStore(store) {
    this.store = store;
  }

  async apply(command) {
    console.log('apply');
    let events = await this.store.find({'data.agency_id': this.agency_id, 'data.client_id': this.client_id}).sort({chrono_id: 1}).lean();
    console.log(events);
    this.projection = _.reduce(events, event_applier, {});
    console.log('events and projection complete');
    switch(command.type) {
      case 'assignClientConsultant': this.assignConsultant(command.data);
      break;
      default:
        throw new Error(`Command type:${command.type} is not supported`);
    }
  }

  assignConsultant(consultant) {
    if (_.find(this.projection.consultants, {consultant_type: 'portfolio'}) !== undefined) {
      throw new Error('TOO MANY PORTFOLIO CONSULTANTS');
    }
    console.log('assignConsultant');
  }

  // Does not belong here
  storeEvents() {

  }
}

const event_applier = (aggregate, event) => {
  return agg_projection[event.type](aggregate, event);
}

module.exports = AgencyClient