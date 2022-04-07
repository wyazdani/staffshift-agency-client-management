import {
  AgencyConsultantRoleAddedEventStoreDataInterface,
  AgencyConsultantRoleEnabledEventStoreDataInterface
} from 'EventTypes';
import {AgencyRepository} from '../AgencyRepository';
import {AgencyCommandHandlerInterface} from '../types/AgencyCommandHandlerInterface';
import {AddAgencyConsultantRoleCommandInterface} from '../types/CommandTypes';
import {AgencyCommandEnum} from '../types';
import {EventsEnum} from '../../../Events';

/**
 * Class responsible for handling addAgencyConsultantRole command
 */
export class AddAgencyConsultantRoleCommandHandler implements AgencyCommandHandlerInterface {
  public commandType = AgencyCommandEnum.ADD_AGENCY_CONSULTANT_ROLE;

  constructor(private agencyRepository: AgencyRepository) {}

  /**
   * Build and save events caused by disableAgencyConsultantRole command
   */
  async execute(command: AddAgencyConsultantRoleCommandInterface): Promise<void> {
    const aggregate = await this.agencyRepository.getAggregate(command.aggregateId);
    let seqId = aggregate.getLastSequenceId();
    // We are looking to auto enable newly created consultant roles hence the two events

    await this.agencyRepository.save([
      {
        type: EventsEnum.AGENCY_CONSULTANT_ROLE_ADDED,
        aggregate_id: aggregate.getId(),
        data: {
          _id: command.data._id,
          name: command.data.name,
          description: command.data.description,
          max_consultants: command.data.max_consultants
        } as AgencyConsultantRoleAddedEventStoreDataInterface,
        sequence_id: ++seqId
      },
      {
        type: EventsEnum.AGENCY_CONSULTANT_ROLE_ENABLED,
        aggregate_id: aggregate.getId(),
        data: {
          _id: command.data._id
        } as AgencyConsultantRoleEnabledEventStoreDataInterface,
        sequence_id: ++seqId
      }
    ]);
  }
}
