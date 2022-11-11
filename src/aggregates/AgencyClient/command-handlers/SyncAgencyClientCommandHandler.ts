import {AgencyClientSyncedEventStoreDataInterface} from 'EventTypes';
import {AgencyClientRepository} from '../AgencyClientRepository';
import {AgencyClientCommandHandlerInterface} from '../types/AgencyClientCommandHandlerInterface';
import {AgencyClientCommandEnum} from '../types';
import {EventsEnum} from '../../../Events';
import {SyncAgencyClientCommandInterface} from '../types/CommandTypes';

/**
 * Class responsible for handling syncAgencyClient command
 */
export class SyncAgencyClientCommandHandler implements AgencyClientCommandHandlerInterface {
  public commandType = AgencyClientCommandEnum.SYNC_AGENCY_CLIENT;

  constructor(private agencyClientRepository: AgencyClientRepository) {}

  /**
   * Build and save event caused by syncAgencyClient command
   */
  async execute(command: SyncAgencyClientCommandInterface): Promise<number> {
    const aggregate = await this.agencyClientRepository.getAggregate(command.aggregateId);

    // Only create the event if we are not aware of this aggregate
    if (aggregate.getLastSequenceId() === 0) {
      let eventId = aggregate.getLastSequenceId();

      await this.agencyClientRepository.save([
        {
          type: EventsEnum.AGENCY_CLIENT_SYNCED,
          aggregate_id: aggregate.getId(),
          data: {...command.data} as AgencyClientSyncedEventStoreDataInterface,
          sequence_id: ++eventId
        }
      ]);
      return eventId;
    }
  }
}
