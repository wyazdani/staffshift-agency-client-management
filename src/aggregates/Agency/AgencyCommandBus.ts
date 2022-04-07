import {AgencyCommandHandlerInterface} from './types/AgencyCommandHandlerInterface';
import {
  AddAgencyConsultantRoleCommandHandler,
  UpdateAgencyConsultantRoleCommandHandler,
  EnableAgencyConsultantRoleCommandHandler,
  DisableAgencyConsultantRoleCommandHandler
} from './command-handlers';
import {AgencyRepository} from './AgencyRepository';
import {EventRepository} from '../../EventRepository';
import {AgencyWriteProjectionHandler} from './AgencyWriteProjectionHandler';
import {CommandBus} from '../CommandBus';
const handlers = [
  AddAgencyConsultantRoleCommandHandler,
  UpdateAgencyConsultantRoleCommandHandler,
  EnableAgencyConsultantRoleCommandHandler,
  DisableAgencyConsultantRoleCommandHandler
];

/**
 * Responsible for routing all agency related commands to their corresponding handlers
 */
export class AgencyCommandBus {
  private commandHandlers: AgencyCommandHandlerInterface[] = [];

  static registerCommandHandlers(eventRepository: EventRepository, commandBus: CommandBus) {
    const agencyRepository = new AgencyRepository(eventRepository, new AgencyWriteProjectionHandler());

    for (const item of handlers) {
      commandBus.registerAggregateCommand(new item(agencyRepository));
    }
  }
}
