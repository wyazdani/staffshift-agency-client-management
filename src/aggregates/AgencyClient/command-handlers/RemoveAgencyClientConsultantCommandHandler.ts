import {AgencyClientConsultantUnassignedEventStoreDataInterface} from 'EventTypes';
import {AgencyClientRepository} from '../AgencyClientRepository';
import {AgencyClientCommandHandlerInterface} from '../types/AgencyClientCommandHandlerInterface';
import {AgencyClientCommandEnum} from '../types';
import {EventsEnum} from '../../../Events';
import {RemoveAgencyClientConsultantCommandInterface} from '../types/CommandTypes';

/**
 * Class responsible for handling removeAgencyClientConsultant command
 */
export class RemoveAgencyClientConsultantCommandHandler implements AgencyClientCommandHandlerInterface {
  public commandType = AgencyClientCommandEnum.REMOVE_AGENCY_CLIENT_CONSULTANT;

  constructor(private agencyClientRepository: AgencyClientRepository) {}

  /**
   * Build and save event caused by removeAgencyClientConsultant command
   */
  async execute(command: RemoveAgencyClientConsultantCommandInterface): Promise<number> {
    const aggregate = await this.agencyClientRepository.getAggregate(command.aggregateId);

    await aggregate.validateRemoveClientConsultant(command.data);
    let eventId = aggregate.getLastSequenceId();

    await this.agencyClientRepository.save([
      {
        type: EventsEnum.AGENCY_CLIENT_CONSULTANT_UNASSIGNED,
        aggregate_id: aggregate.getId(),
        data: {
          _id: command.data._id
        } as AgencyClientConsultantUnassignedEventStoreDataInterface,
        sequence_id: ++eventId
      }
    ]);
    return eventId;
  }
}
