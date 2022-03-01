import {AgencyClientConsultantUnassignedEventStoreDataInterface} from 'EventStoreDataTypes';
import {AgencyClientRepository} from '../AgencyClientRepository';
import {AgencyClientCommandHandlerInterface} from '../types/AgencyClientCommandHandlerInterface';
import {AgencyClientCommandEnum} from '../types';
import {RemoveAgencyClientConsultantCommandDataInterface} from '../types/CommandDataTypes';
import {EventsEnum} from '../../../Events';

/**
 * Class responsible for handling removeAgencyClientConsultant command
 */
export class RemoveAgencyClientConsultantCommandHandler implements AgencyClientCommandHandlerInterface {
  public commandType = AgencyClientCommandEnum.REMOVE_AGENCY_CLIENT_CONSULTANT;

  constructor(private agencyClientRepository: AgencyClientRepository) {}

  /**
   * Build and save event caused by removeAgencyClientConsultant command
   */
  async execute(
    agencyId: string,
    clientId: string,
    commandData: RemoveAgencyClientConsultantCommandDataInterface
  ): Promise<void> {
    const aggregate = await this.agencyClientRepository.getAggregate(agencyId, clientId);

    await aggregate.validateRemoveClientConsultant(commandData);
    const eventId = aggregate.getLastEventId();

    await this.agencyClientRepository.save([
      {
        type: EventsEnum.AGENCY_CLIENT_CONSULTANT_UNASSIGNED,
        aggregate_id: aggregate.getId(),
        data: {
          _id: commandData._id
        } as AgencyClientConsultantUnassignedEventStoreDataInterface,
        sequence_id: eventId + 1
      }
    ]);
  }
}
