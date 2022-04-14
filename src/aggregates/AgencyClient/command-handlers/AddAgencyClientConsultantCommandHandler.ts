import {AgencyClientConsultantAssignedEventStoreDataInterface} from 'EventTypes';
import {AgencyClientRepository} from '../AgencyClientRepository';
import {AgencyClientCommandHandlerInterface} from '../types/AgencyClientCommandHandlerInterface';
import {AgencyClientCommandEnum} from '../types';
import {EventsEnum} from '../../../Events';
import {AddAgencyClientConsultantCommandInterface} from '../types/CommandTypes';

/**
 * Class responsible for handling addAgencyClientConsultant command
 */
export class AddAgencyClientConsultantCommandHandler implements AgencyClientCommandHandlerInterface {
  public commandType = AgencyClientCommandEnum.ADD_AGENCY_CLIENT_CONSULTANT;

  constructor(private agencyClientRepository: AgencyClientRepository) {}

  /**
   * Build and save event caused by addAgencyClientConsultant command
   */
  async execute(command: AddAgencyClientConsultantCommandInterface): Promise<void> {
    const aggregate = await this.agencyClientRepository.getAggregate(command.aggregateId);

    await aggregate.validateAddClientConsultant(command.data);
    const eventId = aggregate.getLastSequenceId();

    await this.agencyClientRepository.save([
      {
        type: EventsEnum.AGENCY_CLIENT_CONSULTANT_ASSIGNED,
        aggregate_id: aggregate.getId(),
        data: command.data as AgencyClientConsultantAssignedEventStoreDataInterface,
        sequence_id: eventId + 1
      }
    ]);
  }
}
