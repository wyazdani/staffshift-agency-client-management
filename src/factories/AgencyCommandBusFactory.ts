import {AgencyCommandBus} from '../aggregates/Agency/AgencyCommandBus';
import {AddAgencyConsultantRoleCommandHandler} from '../aggregates/Agency/command-handlers/AddAgencyConsultantRoleCommandHandler';
import {UpdateAgencyConsultantRoleCommandHandler} from '../aggregates/Agency/command-handlers/UpdateAgencyConsultantRoleCommandHandler';
import {DisableAgencyConsultantRoleCommandHandler} from '../aggregates/Agency/command-handlers/DisableAgencyConsultantRoleCommandHandler';
import {EnableAgencyConsultantRoleCommandHandler} from '../aggregates/Agency/command-handlers/EnableAgencyConsultantRoleCommandHandler';
import {AgencyRepository} from '../aggregates/Agency/AgencyRepository';
import {EventRepository} from '../EventRepository';
import {AgencyWriteProjectionHandler} from '../aggregates/Agency/AgencyWriteProjectionHandler';

/**
 * Factory class responsible for building an AgencyCommandBus configured with supported command handlers
 */
export class AgencyCommandBusFactory {
  /**
   * Returns an instance of AgencyCommandBus with a list of supported command handlers configured
   */
  static getCommandBus(eventRepository: EventRepository): AgencyCommandBus {
    const agencyRepository = new AgencyRepository(eventRepository, new AgencyWriteProjectionHandler());
    const commandBus = new AgencyCommandBus();

    commandBus
      .addHandler(new AddAgencyConsultantRoleCommandHandler(agencyRepository))
      .addHandler(new DisableAgencyConsultantRoleCommandHandler(agencyRepository))
      .addHandler(new EnableAgencyConsultantRoleCommandHandler(agencyRepository))
      .addHandler(new UpdateAgencyConsultantRoleCommandHandler(agencyRepository));
    return commandBus;
  }
}
