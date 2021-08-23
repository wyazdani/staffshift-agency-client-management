'use strict';
const _ = require('lodash');

// This could be used to generate documentation
const events = {
  AGENCY_CONSULTANT_ROLE_ADDED: {
    name: 'AgencyConsultantRoleAdded',
    description: 'The Agency Consultant Role has been created'
  },
  AGENCY_CONSULTANT_ROLE_REMOVED: {
    name: 'AgencyConsultantRoleRemoved',
    description: 'The Agency Consultant Role has been removed'
  },
  AGENCY_CLIENT_CONSULTANT_ADDED: {
    name: 'AgencyClientConsultantAdded',
    description: 'The Agency Client Consultant has been added'
  },
  AGENCY_CLIENT_CONSULTANT_REMOVED: {
    name: 'AgencyClientConsultantRemoved',
    description: 'The Agency Client Consultant has been removed'
  },
  AGENCY_CLIENT_LINKED: {
    name: 'AgencyClientLinked',
    description: 'The Agency Client was linked'
  },
  AGENCY_CLIENT_UNLINKED: {
    name: 'AgencyClientUnLinked',
    description: 'The Agency Client was unlinked, does not indicate a deletion'
  }
}

// Simple event K=V to use within the code base
const  reducedEvents = _.reduce(events, (result, value, key) => {
  result[key] = value.name;
  return result;
}, {})

module.exports = reducedEvents;