'use strict';
const _ = require('lodash');
const ObjectID = require('mongodb').ObjectID;

const AgencyConsultantRoleCommands = {
  'addAgencyConsultantRole': async (aggregate, command) => {
    let event_id = aggregate.getLastEventId();
    console.log('addAgencyConsultantRole');
    return {
      type: 'AgencyConsultantRoleAdded',
      data: {
        _id: (new ObjectID).toString(),
        agency_id: aggregate.getAgencyId(),
        name: command.name,
        description: command.description,
        max_consultants: command.max_consultants
      },
      chrono_id: ++event_id
    }
  }
}

module.exports = AgencyConsultantRoleCommands