import {AgencyClientRepository} from '../AgencyClientRepository';
import {AgencyClientCommandHandlerInterface} from '../types/AgencyClientCommandHandlerInterface';
import {AgencyClientCommandEnum, AgencyClientEventEnum} from '../types';
import {UnlinkAgencyClientCommandDataInterface} from '../types/CommandDataTypes';

/**
 * Class responsible for handling unlinkAgencyClient command
 */
export class UnlinkAgencyClientCommandHandler implements AgencyClientCommandHandlerInterface {
  public commandType = AgencyClientCommandEnum.UNLINK_AGENCY_CLIENT;

  constructor(private agencyClientRepository: AgencyClientRepository) {}

  /**
   * Build and save event caused by unlinkAgencyClient command
   */
  async execute(
    agencyId: string,
    clientId: string,
    commandData: UnlinkAgencyClientCommandDataInterface
  ): Promise<void> {
    const aggregate = await this.agencyClientRepository.getAggregate(agencyId, clientId);

    const isLinked = aggregate.isLinked();

    // If linked OR this is the first time we are dealing with this aggregate
    if (isLinked || aggregate.getLastEventId() == 0) {
      const eventId = aggregate.getLastEventId();

      await this.agencyClientRepository.save([
        {
          type: AgencyClientEventEnum.AGENCY_CLIENT_UNLINKED,
          aggregate_id: aggregate.getId(),
          data: {...commandData},
          sequence_id: eventId + 1
        }
      ]);
    }
  }
}
