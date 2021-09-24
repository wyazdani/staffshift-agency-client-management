import {AgencyClientRepository} from '../AgencyClientRepository';
import {AgencyClientCommandHandlerInterface} from '../types/AgencyClientCommandHandlerInterface';
import {AgencyClientCommandEnum, AgencyClientEventEnum} from '../types';
import {SyncAgencyClientCommandDataInterface} from '../types/CommandDataTypes';

export class SyncAgencyClientCommandHandler implements AgencyClientCommandHandlerInterface {
  public commandType = AgencyClientCommandEnum.SYNC_AGENCY_CLIENT;

  constructor(private agencyClientRepository: AgencyClientRepository) {}

  async execute(agencyId: string, clientId: string, commandData: SyncAgencyClientCommandDataInterface): Promise<void> {
    const aggregate = await this.agencyClientRepository.getAggregate(agencyId, clientId);

    // Only create the event if we are not aware of the this aggregate
    if (aggregate.getLastEventId() === 0) {
      let eventId = aggregate.getLastEventId();

      await this.agencyClientRepository.save([
        {
          type: AgencyClientEventEnum.AGENCY_CLIENT_SYNCED,
          aggregate_id: aggregate.getId(),
          data: {...commandData},
          sequence_id: ++eventId
        }
      ]);
    }
  }
}
