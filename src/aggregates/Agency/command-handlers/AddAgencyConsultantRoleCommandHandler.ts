import {
  AgencyConsultantRoleAddedEventStoreDataInterface,
  AgencyConsultantRoleEnabledEventStoreDataInterface
} from 'EventTypes';
import {AgencyRepository} from '../AgencyRepository';
import {AgencyCommandHandlerInterface} from '../types/AgencyCommandHandlerInterface';
import {AddAgencyConsultantRoleCommandDataInterface} from '../types/CommandDataTypes';
import {AgencyAggregateCommandInterface, AgencyCommandEnum} from '../types';
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
  async execute(command: AgencyAggregateCommandInterface): Promise<void> {
    const aggregate = await this.agencyRepository.getAggregate(command.aggregateId);
    let seqId = aggregate.getLastSequenceId();
    // We are looking to auto enable newly created consultant roles hence the two events
    const commandData = command.data as AddAgencyConsultantRoleCommandDataInterface;

    await this.agencyRepository.save([
      {
        type: EventsEnum.AGENCY_CONSULTANT_ROLE_ADDED,
        aggregate_id: aggregate.getId(),
        data: {
          _id: commandData._id,
          name: commandData.name,
          description: commandData.description,
          max_consultants: commandData.max_consultants
        } as AgencyConsultantRoleAddedEventStoreDataInterface,
        sequence_id: ++seqId
      },
      {
        type: EventsEnum.AGENCY_CONSULTANT_ROLE_ENABLED,
        aggregate_id: aggregate.getId(),
        data: {
          _id: commandData._id
        } as AgencyConsultantRoleEnabledEventStoreDataInterface,
        sequence_id: ++seqId
      }
    ]);
  }
}
