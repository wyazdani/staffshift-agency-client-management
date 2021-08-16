'use strict';
const _ = require('lodash');

const projections = {
  'AgencyConsultantRoleAdded': (aggregate, event) => {
    console.log('ClientLinkCreated');
    return {...event.data, last_chrono_id: event.chrono_id};
  }
}

module.exports = projections