import {
  SetRequiresPONumberCommandHandler,
  UnsetRequiresPONumberCommandHandler,
  SetRequiresShiftRefNumberCommandHandler,
  UnsetRequiresShiftRefNumberCommandHandler
} from './command-handlers';
import {BookingPreferenceRepository} from './BookingPreferenceRepository';
import {EventRepository} from '../../EventRepository';
import {BookingPreferenceWriteProjectionHandler} from './BookingPreferenceWriteProjectionHandler';
import {BookingPreferenceCommandHandlerInterface} from './types/BookingPreferenceCommandHandlerInterface';

const handlers = [
  UnsetRequiresPONumberCommandHandler,
  SetRequiresPONumberCommandHandler,
  UnsetRequiresShiftRefNumberCommandHandler,
  SetRequiresShiftRefNumberCommandHandler
];

/**
 * Responsible for routing all commands to their corresponding handlers
 */
export class BookingPreferenceCommandBus {
  static getCommandHandlers(eventRepository: EventRepository): BookingPreferenceCommandHandlerInterface[] {
    const items = [];
    const aggregateRepository = new BookingPreferenceRepository(
      eventRepository,
      new BookingPreferenceWriteProjectionHandler()
    );

    for (const item of handlers) {
      items.push(new item(aggregateRepository));
    }
    return items;
  }
}
