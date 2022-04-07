import {AgencyClientLinkedEventStoreDataInterface} from 'EventTypes';
import {AgencyClientRepository} from '../AgencyClientRepository';
import {AgencyClientCommandHandlerInterface} from '../types/AgencyClientCommandHandlerInterface';
import {AgencyClientCommandEnum} from '../types';
import {EventsEnum} from '../../../Events';
import {LinkAgencyClientCommandInterface} from '../types/CommandTypes';

/**
 * Class responsible for handling linkAgencyClient command
 */
export class LinkAgencyClientCommandHandler implements AgencyClientCommandHandlerInterface {
  public commandType = AgencyClientCommandEnum.LINK_AGENCY_CLIENT;

  constructor(private agencyClientRepository: AgencyClientRepository) {}

  /**
   * Build and save event caused by linkAgencyClient command
   */
  async execute(command: LinkAgencyClientCommandInterface): Promise<void> {
    const aggregate = await this.agencyClientRepository.getAggregate(command.aggregateId);

    const isNotLinked = !aggregate.isLinked();

    if (isNotLinked) {
      const eventId = aggregate.getLastEventId();

      await this.agencyClientRepository.save([
        {
          type: EventsEnum.AGENCY_CLIENT_LINKED,
          aggregate_id: aggregate.getId(),
          data: {...command.data} as AgencyClientLinkedEventStoreDataInterface,
          sequence_id: eventId + 1
        }
      ]);
    }
  }
}
