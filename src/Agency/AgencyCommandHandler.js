'use strict';
const cmds = require('./AgencyCommands');

class AgencyCommandHandler {
  constructor(repository) {
    this._repository = repository;
  }

  async apply(agency_id, command) {
    let aggregate = await this._repository.getAggregate(agency_id);
    if (!cmds[command.type]) {
      throw new Error(`Command type:${command.type} is not supported`);
    }
    let newEvents = await cmds[command.type](aggregate, command.data);
    this._repository.save(newEvents);
  }
}

module.exports = {AgencyCommandHandler};