import {StartConsultantJobAssignCommandHandler} from './command-handlers';
import {EventRepository} from '../../EventRepository';
import {ConsultantJobAssignRepository} from './ConsultantJobAssignRepository';
import {ConsultantJobAssignWriteProjectionHandler} from './ConsultantJobAssignWriteProjectionHandler';
import {CommandBus} from '../CommandBus';

const handlers = [StartConsultantJobAssignCommandHandler];

/**
 * Responsible for routing all commands to their corresponding handlers
 */
export class ConsultantJobAssignCommandBus {
  static registerCommandHandlers(eventRepository: EventRepository, commandBus: CommandBus): void {
    const repository = new ConsultantJobAssignRepository(
      eventRepository,
      new ConsultantJobAssignWriteProjectionHandler()
    );

    for (const item of handlers) {
      commandBus.registerAggregateCommand(new item(repository));
    }
  }
}
