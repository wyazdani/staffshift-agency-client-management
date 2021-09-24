import {AgencyClientRepository} from '../AgencyClient/AgencyClientRepository';
import {EventRepository} from '../EventRepository';
import {AddAgencyClientConsultantCommandHandler} from '../AgencyClient/command-handlers/AddAgencyClientConsultantCommandHandler';
import {LinkAgencyClientCommandHandler} from '../AgencyClient/command-handlers/LinkAgencyClientCommandHandler';
import {SyncAgencyClientCommandHandler} from '../AgencyClient/command-handlers/SyncAgencyClientCommandHandler';
import {UnlinkAgencyClientCommandHandler} from '../AgencyClient/command-handlers/UnlinkAgencyClientCommandHandler';
import {AgencyClientCommandBus} from '../AgencyClient/AgencyClientCommandBus';
import {RemoveAgencyClientConsultantCommandHandler} from '../AgencyClient/command-handlers/RemoveAgencyClientConsultantCommandHandler';

export class AgencyClientCommandBusFactory {
  static getCommandBus(eventRepository: EventRepository): AgencyClientCommandBus {
    const agencyClientRepository = new AgencyClientRepository(eventRepository);
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
