import {AgencyCommands} from './AgencyCommands';
import {AgencyRepository} from './AgencyRepository';
import {EventStoreDocumentType} from '../models/EventStore';
import {AgencyCommandInterface} from './types';

export class AgencyCommandHandler {
  constructor(private repository: AgencyRepository) {}

  async apply(agencyId: string, command: AgencyCommandInterface): Promise<EventStoreDocumentType[]> {
    // we need to add try catch here to handle the errors from these awaits.
    const aggregate = await this.repository.getAggregate(agencyId);

    if (!AgencyCommands[command.type]) {
      throw new Error(`Command type:${command.type} is not supported`);
    }
    const newEvents = await AgencyCommands[command.type](aggregate, command.data);

    return this.repository.save(newEvents);
  }
}
