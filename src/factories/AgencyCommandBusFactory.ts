import {AgencyCommandBus} from '../Agency/AgencyCommandBus';
import {AddAgencyConsultantRoleCommandHandler} from '../Agency/command-handlers/AddAgencyConsultantRoleCommandHandler';
import {UpdateAgencyConsultantRoleCommandHandler} from '../Agency/command-handlers/UpdateAgencyConsultantRoleCommandHandler';
import {DisableAgencyConsultantRoleCommandHandler} from '../Agency/command-handlers/DisableAgencyConsultantRoleCommandHandler';
import {EnableAgencyConsultantRoleCommandHandler} from '../Agency/command-handlers/EnableAgencyConsultantRoleCommandHandler';
import {AgencyRepository} from '../Agency/AgencyRepository';
import {EventRepository} from '../EventRepository';
import {AgencyWriteProjectionHandler} from '../Agency/AgencyWriteProjection';
import {AgencyAggregateIdInterface, AgencyAggregateRecordInterface} from '../Agency/types';
import {AgencyCommandDataType} from '../Agency/types/AgencyCommandDataType';

/**
 * Factory class responsible for building an AgencyCommandBus configured with supported command handlers
 */
export class AgencyCommandBusFactory {
  /**
   * Returns an instance of AgencyCommandBus with a list of supported command handlers configured
   *
   *   AggregateIdType extends BaseAggregateIdInterface,
   EventData extends AgencyCommandDataType | AgencyClientCommandDataType,
   AggregateType extends BaseAggregateRecordInterface
   */
  static getCommandBus(
    eventRepository: EventRepository<AgencyAggregateIdInterface, AgencyCommandDataType, AgencyAggregateRecordInterface>
  ): AgencyCommandBus {
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
