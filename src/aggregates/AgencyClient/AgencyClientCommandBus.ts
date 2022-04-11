import {
  AddAgencyClientConsultantCommandHandler,
  RemoveAgencyClientConsultantCommandHandler,
  LinkAgencyClientCommandHandler,
  UnlinkAgencyClientCommandHandler,
  SyncAgencyClientCommandHandler
} from './command-handlers';
import {AgencyClientWriteProjectionHandler} from './AgencyClientWriteProjectionHandler';
import {AgencyRepository} from '../Agency/AgencyRepository';
import {AgencyWriteProjectionHandler} from '../Agency/AgencyWriteProjectionHandler';
import {EventRepository} from '../../../src/EventRepository';
import {AgencyClientRepository} from './AgencyClientRepository';
import {AgencyClientCommandHandlerInterface} from './types/AgencyClientCommandHandlerInterface';

const handlers = [
  AddAgencyClientConsultantCommandHandler,
  RemoveAgencyClientConsultantCommandHandler,
  LinkAgencyClientCommandHandler,
  UnlinkAgencyClientCommandHandler,
  SyncAgencyClientCommandHandler
];

/**
 * Responsible for routing all agency client related commands to their corresponding handlers
 */
export class AgencyClientCommandBus {
  static getCommandHandlers(eventRepository: EventRepository): AgencyClientCommandHandlerInterface[] {
    const agencyRepository = new AgencyRepository(eventRepository, new AgencyWriteProjectionHandler());
    const agencyClientRepository = new AgencyClientRepository(
      eventRepository,
      new AgencyClientWriteProjectionHandler(),
      agencyRepository
    );
    const items = [];

    for (const item of handlers) {
      items.push(new item(agencyClientRepository));
    }
    return items;
  }
}
