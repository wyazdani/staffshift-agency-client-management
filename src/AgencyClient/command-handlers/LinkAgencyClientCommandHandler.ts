import {AgencyClientRepository} from '../AgencyClientRepository';
import {AgencyClientCommandHandlerInterface} from '../types/AgencyClientCommandHandlerInterface';
import {AgencyClientCommandEnum, AgencyClientEventEnum} from '../types';
import {LinkAgencyClientCommandDataInterface} from '../types/CommandDataTypes';

export class LinkAgencyClientCommandHandler implements AgencyClientCommandHandlerInterface {
  public commandType = AgencyClientCommandEnum.LINK_AGENCY_CLIENT;

  constructor(private agencyClientRepository: AgencyClientRepository) {}

  async execute(agencyId: string, clientId: string, commandData: LinkAgencyClientCommandDataInterface): Promise<void> {
    const aggregate = await this.agencyClientRepository.getAggregate(agencyId, clientId);

    const isNotLinked = !aggregate.isLinked();

    if (isNotLinked) {
      const eventId = aggregate.getLastEventId();

      await this.agencyClientRepository.save([
        {
          type: AgencyClientEventEnum.AGENCY_CLIENT_LINKED,
          aggregate_id: aggregate.getId(),
          data: {...commandData},
          sequence_id: eventId + 1
        }
      ]);
    }
  }
}
