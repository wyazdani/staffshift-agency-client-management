import {
  ApplyPaymentTermOrganisationJobCommandHandler,
  CompleteApplyPaymentTermInheritanceOrganisationJobCommandHandler,
  CompleteApplyPaymentTermOrganisationJobCommandHandler,
  InheritPaymentTermOrganisationJobCommandHandler
} from './command-handlers';
import {EventRepository} from '../../EventRepository';
import {OrganisationJobCommandHandlerInterface} from './types/OrganisationJobCommandHandlerInterface';
import {OrganisationJobRepository} from './OrganisationJobRepository';
import {OrganisationJobWriteProjectionHandler} from './OrganisationJobWriteProjectionHandler';

const handlers = [
  ApplyPaymentTermOrganisationJobCommandHandler,
  CompleteApplyPaymentTermInheritanceOrganisationJobCommandHandler,
  CompleteApplyPaymentTermOrganisationJobCommandHandler,
  InheritPaymentTermOrganisationJobCommandHandler
];

/**
 * Responsible for routing all commands to their corresponding handlers
 */
export class OrganisationJobCommandBus {
  static getCommandHandlers(eventRepository: EventRepository): OrganisationJobCommandHandlerInterface[] {
    const items = [];
    const repository = new OrganisationJobRepository(eventRepository, new OrganisationJobWriteProjectionHandler());

    for (const item of handlers) {
      items.push(new item(repository));
    }
    return items;
  }
}
