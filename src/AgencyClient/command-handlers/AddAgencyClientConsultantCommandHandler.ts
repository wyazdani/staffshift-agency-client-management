import {AgencyClientRepository} from '../AgencyClientRepository';
import {AgencyClientCommandHandlerInterface} from '../types/AgencyClientCommandHandlerInterface';
import {AgencyClientCommandEnum, AgencyClientEventEnum} from '../types';
import {AddAgencyClientConsultantCommandDataInterface} from '../types/CommandDataTypes';

/**
 * Class responsible for handling addAgencyClientConsultant command
 */
export class AddAgencyClientConsultantCommandHandler implements AgencyClientCommandHandlerInterface {
  public commandType = AgencyClientCommandEnum.ADD_AGENCY_CLIENT_CONSULTANT;

  constructor(private agencyClientRepository: AgencyClientRepository) {}

  /**
   * Build and save event caused by addAgencyClientConsultant command
   */
  async execute(
    agencyId: string,
    clientId: string,
    commandData: AddAgencyClientConsultantCommandDataInterface
  ): Promise<void> {
    const aggregate = await this.agencyClientRepository.getAggregate(agencyId, clientId);

    await aggregate.validateAddClientConsultant(commandData);
    const eventId = aggregate.getLastEventId();

    await this.agencyClientRepository.save([
      {
        type: AgencyClientEventEnum.AGENCY_CLIENT_CONSULTANT_ASSIGNED,
        aggregate_id: aggregate.getId(),
        data: commandData,
        sequence_id: eventId + 1
      }
    ]);
  }
}
