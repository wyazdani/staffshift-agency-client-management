import {
  StartConsultantJobAssignCommandHandler,
  SucceedItemConsultantJobAssignCommandHandler,
  FailItemConsultantJobAssignCommandHandler,
  CompleteConsultantJobAssignCommandHandler
} from './command-handlers';
import {EventRepository} from '../../EventRepository';
import {ConsultantJobAssignRepository} from './ConsultantJobAssignRepository';
import {ConsultantJobAssignWriteProjectionHandler} from './ConsultantJobAssignWriteProjectionHandler';
import {ConsultantJobAssignCommandHandlerInterface} from './types/ConsultantJobAssignCommandHandlerInterface';

const handlers = [
  StartConsultantJobAssignCommandHandler,
  SucceedItemConsultantJobAssignCommandHandler,
  FailItemConsultantJobAssignCommandHandler,
  CompleteConsultantJobAssignCommandHandler
];

/**
 * Responsible for routing all commands to their corresponding handlers
 */
export class ConsultantJobAssignCommandBus {
  static getCommandHandlers(eventRepository: EventRepository): ConsultantJobAssignCommandHandlerInterface[] {
    const items = [];
    const repository = new ConsultantJobAssignRepository(
      eventRepository,
      new ConsultantJobAssignWriteProjectionHandler()
    );

    for (const item of handlers) {
      items.push(new item(repository));
    }
    return items;
  }
}
