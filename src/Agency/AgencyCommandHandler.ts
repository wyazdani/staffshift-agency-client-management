
import {AgencyCommands} from './AgencyCommands';
import {AgencyRepository} from './AgencyRepository';
import {AgencyCommand} from './Interfaces';
import {EventStoreDocument} from '../models/EventStore';

export class AgencyCommandHandler {
  constructor(private repository: AgencyRepository) {
  }

  async apply(agency_id: string, command: AgencyCommand): Promise<EventStoreDocument[]> {
    // we need to add try catch here to handle the errors from these awaits.
    const aggregate = await this.repository.getAggregate(agency_id);
    if (!AgencyCommands[command.type]) {
      throw new Error(`Command type:${command.type} is not supported`);
    }
    const newEvents = await AgencyCommands[command.type](aggregate, command.data);
    return this.repository.save(newEvents);
  }
}

