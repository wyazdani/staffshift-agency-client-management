'use strict';
const _ = require('lodash');

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
    consultant._id = event.data._id;
    consultant.consultant_role_id = event.data.consultant_role_id;
    consultant.consultant_id = event.data.consultant_id;
    (aggregate.consultants) ?
      aggregate.consultants.push(consultant) :
      aggregate.consultants = [consultant];
    return {...aggregate, last_chrono_id: event.chrono_id};
  },
  'ClientConsultantRemoved': (aggregate, event) => {
    console.log('ClientConsultantRemoved');
    aggregate.consultants = _.differenceWith(aggregate.consultants, [event.data], function(value, other) {
      return ((value._id == other._id))
    });
    return {...aggregate, last_chrono_id: event.chrono_id};
  }
}

module.exports = projections