import {AgencyClientRepository} from '../AgencyClient/AgencyClientRepository';
import {EventRepository} from '../EventRepository';
import {AddAgencyClientConsultantCommandHandler} from '../AgencyClient/command-handlers/AddAgencyClientConsultantCommandHandler';
import {LinkAgencyClientCommandHandler} from '../AgencyClient/command-handlers/LinkAgencyClientCommandHandler';
import {SyncAgencyClientCommandHandler} from '../AgencyClient/command-handlers/SyncAgencyClientCommandHandler';
import {UnlinkAgencyClientCommandHandler} from '../AgencyClient/command-handlers/UnlinkAgencyClientCommandHandler';
import {AgencyClientCommandBus} from '../AgencyClient/AgencyClientCommandBus';
import {RemoveAgencyClientConsultantCommandHandler} from '../AgencyClient/command-handlers/RemoveAgencyClientConsultantCommandHandler';
import {AgencyClientAggregateIdInterface, AgencyClientAggregateRecordInterface} from '../AgencyClient/types';
import {AgencyClientCommandDataType} from '../AgencyClient/types/AgencyClientCommandDataType';
import {AgencyRepository} from '../Agency/AgencyRepository';
import {AgencyClientWriteProjectionHandler} from '../AgencyClient/AgencyClientWriteProjectionHandler';

/**
 * Factory class responsible for building an AgencyClientCommandBus configured with supported command handlers
 */
export class AgencyClientCommandBusFactory {
  /**
   * Returns an instance of AgencyClientCommandBus with a list of supported command handlers configured
   */
  static getCommandBus(
    eventRepository: EventRepository<
      AgencyClientAggregateIdInterface,
      AgencyClientCommandDataType,
      AgencyClientAggregateRecordInterface
    >,
    agencyRepository: AgencyRepository
  ): AgencyClientCommandBus {
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
