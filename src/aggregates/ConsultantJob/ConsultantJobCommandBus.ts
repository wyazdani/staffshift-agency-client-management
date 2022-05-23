import {
  AssignConsultantCommandHandler,
  CompleteAssignConsultantCommandHandler,
  UnassignConsultantCommandHandler,
  CompleteUnassignConsultantCommandHandler
} from './command-handlers';
import {ConsultantJobRepository} from './ConsultantJobRepository';
import {AgencyRepository} from '../Agency/AgencyRepository';
import {EventRepository} from '../../EventRepository';
import {AgencyWriteProjectionHandler} from '../Agency/AgencyWriteProjectionHandler';
import {ConsultantJobWriteProjectionHandler} from './ConsultantJobWriteProjectionHandler';
import {ConsultantJobCommandHandlerInterface} from './types/ConsultantJobCommandHandlerInterface';

const handlers = [
  AssignConsultantCommandHandler,
  CompleteAssignConsultantCommandHandler,
  UnassignConsultantCommandHandler,
  CompleteUnassignConsultantCommandHandler
];

/**
 * Responsible for routing all commands to their corresponding handlers
 */
export class ConsultantJobCommandBus {
  static getCommandHandlers(eventRepository: EventRepository): ConsultantJobCommandHandlerInterface[] {
    const items = [];
    const agencyRepository = new AgencyRepository(eventRepository, new AgencyWriteProjectionHandler());
    const consultantRepository = new ConsultantJobRepository(
      eventRepository,
      new ConsultantJobWriteProjectionHandler(),
      agencyRepository
    );

    for (const item of handlers) {
      items.push(new item(consultantRepository));
    }
    return items;
  }
}
