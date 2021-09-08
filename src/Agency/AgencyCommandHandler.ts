
import {AgencyCommands} from './AgencyCommands';
import {AgencyRepository} from './AgencyRepository';
import {AgencyCommand} from './Interfaces';

export class AgencyCommandHandler {
  private repository: AgencyRepository;
  constructor(repository: AgencyRepository) {
    this.repository = repository;
  }

  async apply(agency_id: string, command: AgencyCommand): Promise<any[]> {
    // we need to add try catch here to handle the errors from these awaits.
    const aggregate = await this.repository.getAggregate(agency_id);
    if (!AgencyCommands[command.type]) {
      throw new Error(`Command type:${command.type} is not supported`);
    }
    const newEvents = await AgencyCommands[command.type](aggregate, command.data);
    return this.repository.save(newEvents);
  }
}

