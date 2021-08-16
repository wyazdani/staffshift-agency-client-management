'use strict';
const _ = require('lodash');
const cmds = require('./AgencyConsultantRoleCommands');

class AgencyConsultantRoleCommandHandler {
  constructor(repository) {
    this._repository = repository;
  }

  async apply(agency_id, command) {
    let aggregate = await this._repository.getAgencyConsultantRole(agency_id);

    if (!cmds[command.type]) {
      throw new Error(`Command type:${command.type} is not supported`);
    }
    let new_events = await cmds[command.type](aggregate, command.data);

    this._repository.save(new_events)
  }
}

module.exports = {AgencyConsultantRoleCommandHandler}