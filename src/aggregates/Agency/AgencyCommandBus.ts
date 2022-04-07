import {AgencyCommandHandlerInterface} from './types/AgencyCommandHandlerInterface';
import {AgencyCommandInterface} from './types';
import {
  AddAgencyConsultantRoleCommandHandler,
  UpdateAgencyConsultantRoleCommandHandler,
  EnableAgencyConsultantRoleCommandHandler,
  DisableAgencyConsultantRoleCommandHandler
} from './command-handlers';
import {AgencyRepository} from './AgencyRepository';
import {EventRepository} from '../../EventRepository';
import {AgencyWriteProjectionHandler} from './AgencyWriteProjectionHandler';
import {AggregateCommandBusInterface} from '../AggregateCommandBusInterface';
import {AggregateCommandInterface} from '../AggregateCommandInterface';
import {CommandBus} from '../CommandBus';
import {AggregateCommandHandlerInterface} from '../AggregateCommandHandlerInterface';

const handlers = [AddAgencyConsultantRoleCommandHandler];

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
