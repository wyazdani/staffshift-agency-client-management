import {AgencyClientRepository} from './AgencyClientRepository';
import {AgencyClientCommandInterface} from './Interfaces';
import {AgencyClientCommands} from './AgencyClientCommands';

export class AgencyClientCommandHandler {
  constructor(private repository: AgencyClientRepository) {
  }

  async apply(agencyId: string, clientId: string, command: AgencyClientCommandInterface): Promise<any[]> {
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