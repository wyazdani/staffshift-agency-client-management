import {AgencyClientUnlinkedEventStoreDataInterface} from 'EventTypes';
import {AgencyClientRepository} from '../AgencyClientRepository';
import {AgencyClientCommandHandlerInterface} from '../types/AgencyClientCommandHandlerInterface';
import {AgencyClientCommandEnum} from '../types';
import {EventsEnum} from '../../../Events';
import {UnlinkAgencyClientCommandInterface} from '../types/CommandTypes';

/**
 * Class responsible for handling unlinkAgencyClient command
 */
export class UnlinkAgencyClientCommandHandler implements AgencyClientCommandHandlerInterface {
  public commandType = AgencyClientCommandEnum.UNLINK_AGENCY_CLIENT;

  constructor(private agencyClientRepository: AgencyClientRepository) {}

  /**
   * Build and save event caused by unlinkAgencyClient command
   */
  async execute(command: UnlinkAgencyClientCommandInterface): Promise<number> {
    const aggregate = await this.agencyClientRepository.getAggregate(command.aggregateId);

    const isLinked = aggregate.isLinked();

    // If linked OR this is the first time we are dealing with this aggregate
    if (isLinked || aggregate.getLastSequenceId() == 0) {
      let eventId = aggregate.getLastSequenceId();

      await this.agencyClientRepository.save([
        {
          type: EventsEnum.AGENCY_CLIENT_UNLINKED,
          aggregate_id: aggregate.getId(),
          data: {...command.data} as AgencyClientUnlinkedEventStoreDataInterface,
          sequence_id: ++eventId
        }
      ]);
      return eventId;
    }
  }
}
