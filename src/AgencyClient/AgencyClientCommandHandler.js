'use strict';
const cmds = require('../AgencyClient/commands/aggregate');

class AgencyClientCommandHandler {
  constructor(repository) {
    this._repository = repository;
  }

  async apply(agencyId, clientId, command) {
    let aggregate = await this._repository.getAggregate(agencyId, clientId);
    if (!cmds[command.type]) {
      throw new Error(`Command type:${command.type} is not supported`);
    }
    let newEvents = await cmds[command.type](aggregate, command.data);
    this._repository.save(newEvents);
  }
}

module.exports = {AgencyClientCommandHandler};