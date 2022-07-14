import {ApplyInheritedPaymentTermCommandHandler, ApplyPaymentTermCommandHandler} from './command-handlers';
import {PaymentTermRepository} from './PaymentTermRepository';
import {EventRepository} from '../../EventRepository';
import {PaymentTermWriteProjectionHandler} from './PaymentTermWriteProjectionHandler';
import {PaymentTermCommandHandlerInterface} from './types/PaymentTermCommandHandlerInterface';

const handlers = [ApplyPaymentTermCommandHandler, ApplyInheritedPaymentTermCommandHandler];

/**
 * Responsible for routing all commands to their corresponding handlers
 */
export class PaymentTermCommandBus {
  static getCommandHandlers(eventRepository: EventRepository): PaymentTermCommandHandlerInterface[] {
    const items = [];
    const aggregateRepository = new PaymentTermRepository(eventRepository, new PaymentTermWriteProjectionHandler());

    for (const item of handlers) {
      items.push(new item(aggregateRepository));
    }
    return items;
  }
}
