'user strict';
const _ = require('lodash');

const events = require('./eventstore.json')

const projections = {
  'ClientLinkCreated': (aggregate, event) => {
    console.log('ClientLinkCreated');
    return event.data;
  },
  'ClientUnLinked': (aggregate, event) => {
    console.log('ClientUnLinked');
    aggregate.linked = false
    return aggregate;
  },
  'ClientConsultantAdded': (aggregate, event) => {
    console.log('ClientUnLinked');
    let consultant = {};
    consultant.consultant_type = event.data.consultant_type;
    consultant.consultant_id = event.data.consultant_id;
    (aggregate.consultants) ?
      aggregate.consultants.push(consultant) :
      aggregate.consultants = [consultant];
    return aggregate;
  }
}

const event_applier = (aggregate, event) => {
  console.log('event_applier');
  return projections[event.type](aggregate, event);
}

let value = _.reduce(events, event_applier, {});


  console.log(value);