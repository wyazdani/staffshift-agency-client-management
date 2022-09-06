import {
  SetInheritedFinancialHoldCommandHandler,
  SetFinancialHoldCommandHandler,
  InheritFinancialHoldClientLinkCommandHandler
} from './command-handlers';
import {FinancialHoldRepository} from './FinancialHoldRepository';
import {EventRepository} from '../../EventRepository';
import {FinancialHoldWriteProjectionHandler} from './FinancialHoldWriteProjectionHandler';
import {FinancialHoldCommandHandlerInterface} from './types/FinancialHoldCommandHandlerInterface';

const handlers = [
  SetFinancialHoldCommandHandler,
  SetInheritedFinancialHoldCommandHandler,
  InheritFinancialHoldClientLinkCommandHandler
];

/**
 * Responsible for routing all commands to their corresponding handlers
 */
export class FinancialHoldCommandBus {
  static getCommandHandlers(eventRepository: EventRepository): FinancialHoldCommandHandlerInterface[] {
    const items = [];
    const aggregateRepository = new FinancialHoldRepository(eventRepository, new FinancialHoldWriteProjectionHandler());

    for (const item of handlers) {
      items.push(new item(aggregateRepository));
    }
    return items;
  }
}
