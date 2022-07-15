import {
  StartClientInheritanceProcessCommandHandler,
  SucceedItemClientInheritanceProcessCommandHandler,
  FailItemClientInheritanceProcessCommandHandler,
  CompleteClientInheritanceProcessCommandHandler
} from './command-handlers';
import {EventRepository} from '../../EventRepository';
import {ClientInheritanceProcessRepository} from './ClientInheritanceProcessRepository';
import {ClientInheritanceProcessWriteProjectionHandler} from './ClientInheritanceProcessWriteProjectionHandler';
import {ClientInheritanceProcessCommandHandlerInterface} from './types/ClientInheritanceProcessCommandHandlerInterface';

const handlers = [
  StartClientInheritanceProcessCommandHandler,
  SucceedItemClientInheritanceProcessCommandHandler,
  FailItemClientInheritanceProcessCommandHandler,
  CompleteClientInheritanceProcessCommandHandler
];

/**
 * Responsible for routing all commands to their corresponding handlers
 */
export class ClientInheritanceProcessCommandBus {
  static getCommandHandlers(eventRepository: EventRepository): ClientInheritanceProcessCommandHandlerInterface[] {
    const items = [];
    const repository = new ClientInheritanceProcessRepository(
      eventRepository,
      new ClientInheritanceProcessWriteProjectionHandler()
    );

    for (const item of handlers) {
      items.push(new item(repository));
    }
    return items;
  }
}
