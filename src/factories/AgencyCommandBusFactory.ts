import {AgencyCommandBus} from '../Agency/AgencyCommandBus';
import {AddAgencyConsultantRoleCommandHandler} from '../Agency/command-handlers/AddAgencyConsultantRoleCommandHandler';
import {UpdateAgencyConsultantRoleCommandHandler} from '../Agency/command-handlers/UpdateAgencyConsultantRoleCommandHandler';
import {DisableAgencyConsultantRoleCommandHandler} from '../Agency/command-handlers/DisableAgencyConsultantRoleCommandHandler';
import {EnableAgencyConsultantRoleCommandHandler} from '../Agency/command-handlers/EnableAgencyConsultantRoleCommandHandler';
import {AgencyRepository} from "../Agency/AgencyRepository";

export class AgencyCommandBusFactory {
    static getAgencyCommandBus(agencyRepository: AgencyRepository): AgencyCommandBus {
        const commandBus = new AgencyCommandBus(agencyRepository);
        commandBus
            .addHandler(new AddAgencyConsultantRoleCommandHandler())
            .addHandler(new DisableAgencyConsultantRoleCommandHandler())
            .addHandler(new EnableAgencyConsultantRoleCommandHandler())
            .addHandler(new UpdateAgencyConsultantRoleCommandHandler());
        return commandBus;
    }
}