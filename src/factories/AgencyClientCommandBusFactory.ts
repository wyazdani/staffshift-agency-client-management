import {AgencyClientRepository} from '../aggregates/AgencyClient/AgencyClientRepository';
import {EventRepository} from '../EventRepository';
import {AddAgencyClientConsultantCommandHandler} from '../aggregates/AgencyClient/command-handlers/AddAgencyClientConsultantCommandHandler';
import {LinkAgencyClientCommandHandler} from '../aggregates/AgencyClient/command-handlers/LinkAgencyClientCommandHandler';
import {SyncAgencyClientCommandHandler} from '../aggregates/AgencyClient/command-handlers/SyncAgencyClientCommandHandler';
import {UnlinkAgencyClientCommandHandler} from '../aggregates/AgencyClient/command-handlers/UnlinkAgencyClientCommandHandler';
import {AgencyClientCommandBus} from '../aggregates/AgencyClient/AgencyClientCommandBus';
import {RemoveAgencyClientConsultantCommandHandler} from '../aggregates/AgencyClient/command-handlers/RemoveAgencyClientConsultantCommandHandler';
import {AgencyRepository} from '../aggregates/Agency/AgencyRepository';
import {AgencyClientWriteProjectionHandler} from '../aggregates/AgencyClient/AgencyClientWriteProjectionHandler';

/**
 * Factory class responsible for building an AgencyClientCommandBus configured with supported command handlers
 */
export class AgencyClientCommandBusFactory {
  /**
   * Returns an instance of AgencyClientCommandBus with a list of supported command handlers configured
   */
  static getCommandBus(eventRepository: EventRepository, agencyRepository: AgencyRepository): AgencyClientCommandBus {
    const agencyClientRepository = new AgencyClientRepository(
      eventRepository,
      new AgencyClientWriteProjectionHandler(),
      agencyRepository
    );
    const commandBus = new AgencyClientCommandBus();

    commandBus
      .addHandler(new AddAgencyClientConsultantCommandHandler(agencyClientRepository))
      .addHandler(new LinkAgencyClientCommandHandler(agencyClientRepository))
      .addHandler(new RemoveAgencyClientConsultantCommandHandler(agencyClientRepository))
      .addHandler(new SyncAgencyClientCommandHandler(agencyClientRepository))
      .addHandler(new UnlinkAgencyClientCommandHandler(agencyClientRepository));
    return commandBus;
  }
}
