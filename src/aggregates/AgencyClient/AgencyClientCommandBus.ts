import {AddAgencyClientConsultantCommandHandler} from './command-handlers';
import {AgencyClientWriteProjectionHandler} from './AgencyClientWriteProjectionHandler';
import {AgencyRepository} from '../Agency/AgencyRepository';
import {AgencyWriteProjectionHandler} from '../Agency/AgencyWriteProjectionHandler';
import {CommandBus} from '../CommandBus';
import {EventRepository} from '../../../src/EventRepository';
import {AgencyClientRepository} from './AgencyClientRepository';

const handlers = [AddAgencyClientConsultantCommandHandler];

/**
 * Responsible for routing all agency client related commands to their corresponding handlers
 */
export class AgencyClientCommandBus {
  static registerCommandHandlers(eventRepository: EventRepository, commandBus: CommandBus): void {
    const agencyRepository = new AgencyRepository(eventRepository, new AgencyWriteProjectionHandler());
    const agencyClientRepository = new AgencyClientRepository(
      eventRepository,
      new AgencyClientWriteProjectionHandler(),
      agencyRepository
    );

    for (const item of handlers) {
      commandBus.registerAggregateCommand(new item(agencyClientRepository));
    }
  }
}
