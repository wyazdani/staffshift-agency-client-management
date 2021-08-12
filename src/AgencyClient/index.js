'user strict';
const _ = require('lodash');

const events = require('./eventstore.json')

const projections = {
  'ClientLinkCreated': (aggregate, event) => {
    console.log('ClientLinkCreated');
    return {...event.data, last_chrono_id: event.chrono_id};
  },
  'ClientUnLinked': (aggregate, event) => {
    console.log('ClientUnLinked');
    aggregate.linked = false
    return {...aggregate, last_chrono_id: event.chrono_id};
  },
  'ClientConsultantAdded': (aggregate, event) => {
    console.log('ClientConsultantAdded');
    let consultant = {};
    consultant.consultant_type = event.data.consultant_type;
    consultant.consultant_id = event.data.consultant_id;
    (aggregate.consultants) ?
      aggregate.consultants.push(consultant) :
      aggregate.consultants = [consultant];
    return {...aggregate, last_chrono_id: event.chrono_id};
  },
  'ClientConsultantRemoved': (aggregate, event) => {
    console.log('ClientConsultantRemoved');
    aggregate.consultants = _.differenceWith(aggregate.consultants, [event.data], function(value, other) {
      return ((value.consultant_type == other.consultant_type) && (value.consultant_id == other.consultant_id))
    });
    return {...aggregate, last_chrono_id: event.chrono_id};
  }
}

const event_applier = (aggregate, event) => {
  console.log('event_applier');
  return projections[event.type](aggregate, event);
}

let value = _.reduce(events, event_applier, {});


  console.log(value);