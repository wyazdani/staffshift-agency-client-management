import {AgencyCommandBus} from '../Agency/AgencyCommandBus';
import {AddAgencyConsultantRoleCommandHandler} from '../Agency/command-handlers/AddAgencyConsultantRoleCommandHandler';
import {UpdateAgencyConsultantRoleCommandHandler} from '../Agency/command-handlers/UpdateAgencyConsultantRoleCommandHandler';
import {DisableAgencyConsultantRoleCommandHandler} from '../Agency/command-handlers/DisableAgencyConsultantRoleCommandHandler';
import {EnableAgencyConsultantRoleCommandHandler} from '../Agency/command-handlers/EnableAgencyConsultantRoleCommandHandler';
import {AgencyRepository} from '../Agency/AgencyRepository';
import {EventRepository} from '../EventRepository';

export class AgencyCommandBusFactory {
  static getCommandBus(eventRepository: EventRepository): AgencyCommandBus {
    const agencyRepository = new AgencyRepository(eventRepository);
    const commandBus = new AgencyCommandBus();

    commandBus
      .addHandler(new AddAgencyConsultantRoleCommandHandler(agencyRepository))
      .addHandler(new DisableAgencyConsultantRoleCommandHandler(agencyRepository))
      .addHandler(new EnableAgencyConsultantRoleCommandHandler(agencyRepository))
      .addHandler(new UpdateAgencyConsultantRoleCommandHandler(agencyRepository));
    return commandBus;
  }
}
