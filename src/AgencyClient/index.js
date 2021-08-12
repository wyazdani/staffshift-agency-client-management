'user strict';
const _ = require('lodash');

const events = require('./eventstore.json');
const projections = require('./projections/aggregrate');

const event_applier = (aggregate, event) => {
  console.log('event_applier');
  return projections[event.type](aggregate, event);
}

let value = _.reduce(events, event_applier, {});


  console.log(value);