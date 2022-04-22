import {
  StartConsultantJobProcessCommandHandler,
  SucceedItemConsultantJobProcessCommandHandler,
  FailItemConsultantJobProcessCommandHandler,
  CompleteConsultantJobProcessCommandHandler
} from './command-handlers';
import {EventRepository} from '../../EventRepository';
import {ConsultantJobProcessRepository} from './ConsultantJobProcessRepository';
import {ConsultantJobProcessWriteProjectionHandler} from './ConsultantJobProcessWriteProjectionHandler';
import {ConsultantJobProcessCommandHandlerInterface} from './types/ConsultantJobProcessCommandHandlerInterface';

const handlers = [
  StartConsultantJobProcessCommandHandler,
  SucceedItemConsultantJobProcessCommandHandler,
  FailItemConsultantJobProcessCommandHandler,
  CompleteConsultantJobProcessCommandHandler
];

/**
 * Responsible for routing all commands to their corresponding handlers
 */
export class ConsultantJobProcessCommandBus {
  static getCommandHandlers(eventRepository: EventRepository): ConsultantJobProcessCommandHandlerInterface[] {
    const items = [];
    const repository = new ConsultantJobProcessRepository(
      eventRepository,
      new ConsultantJobProcessWriteProjectionHandler()
    );

    for (const item of handlers) {
      items.push(new item(repository));
    }
    return items;
  }
}
