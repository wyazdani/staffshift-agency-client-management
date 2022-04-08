import {AssignConsultantCommandHandler, CompleteAssignConsultantCommandHandler} from './command-handlers';
import {ConsultantJobRepository} from './ConsultantJobRepository';
import {AgencyRepository} from '../Agency/AgencyRepository';
import {EventRepository} from '../../EventRepository';
import {CommandBus} from '../CommandBus';
import {AgencyWriteProjectionHandler} from '../Agency/AgencyWriteProjectionHandler';
import {ConsultantJobWriteProjectionHandler} from './ConsultantJobWriteProjectionHandler';

const handlers = [AssignConsultantCommandHandler, CompleteAssignConsultantCommandHandler];

/**
 * Responsible for routing all commands to their corresponding handlers
 */
export class ConsultantJobCommandBus {
  static registerCommandHandlers(eventRepository: EventRepository, commandBus: CommandBus): void {
    const agencyRepository = new AgencyRepository(eventRepository, new AgencyWriteProjectionHandler());
    const consultantRepository = new ConsultantJobRepository(
      eventRepository,
      new ConsultantJobWriteProjectionHandler(),
      agencyRepository
    );

    for (const item of handlers) {
      commandBus.registerAggregateCommand(new item(consultantRepository));
    }
  }
}
