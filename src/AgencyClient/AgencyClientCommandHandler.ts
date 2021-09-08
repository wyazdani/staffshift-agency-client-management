import {AgencyClientRepository} from './AgencyClientRepository';
import {AgencyClientCommand} from './Interfaces';
import {AgencyClientCommands} from './AgencyClientCommands';

export class AgencyClientCommandHandler {
  private readonly repository: AgencyClientRepository;
  constructor(repository: AgencyClientRepository) {
    this.repository = repository;
  }

  async apply(agencyId: string, clientId: string, command: AgencyClientCommand): Promise<any[]> {
    // Add try catch to handle these awaits
    const aggregate = await this.repository.getAggregate(agencyId, clientId);
    if (!AgencyClientCommands[command.type]) {
      throw new Error(`Command type:${command.type} is not supported`);
    }
    const newEvents = await AgencyClientCommands[command.type](aggregate, command.data);
    return this.repository.save(newEvents);
  }
}

module.exports = {AgencyClientCommandHandler};