import {ObjectID} from 'mongodb';
import {AgencyRepository} from '../AgencyRepository';
import {AgencyCommandHandlerInterface} from '../types/AgencyCommandHandlerInterface';
import {AddAgencyConsultantRoleCommandDataInterface} from '../types/CommandDataTypes';
import {AgencyCommandEnum, AgencyEventEnum} from '../types';

/**
 * Class responsible for handling addAgencyConsultantRole command
 */
export class AddAgencyConsultantRoleCommandHandler implements AgencyCommandHandlerInterface {
  public commandType = AgencyCommandEnum.ADD_AGENCY_CONSULTANT_ROLE;

  constructor(private agencyRepository: AgencyRepository) {}

  /**
   * Build and save events caused by disableAgencyConsultantRole command
   */
  async execute(agencyId: string, commandData: AddAgencyConsultantRoleCommandDataInterface): Promise<void> {
    const aggregate = await this.agencyRepository.getAggregate(agencyId);
    let eventId = aggregate.getLastEventId();
    // We are looking to auto enable newly created consultant roles hence the two events
    const consultantId = new ObjectID().toString();

    await this.agencyRepository.save([
      {
        type: AgencyEventEnum.AGENCY_CONSULTANT_ROLE_ADDED,
        aggregate_id: aggregate.getId(),
        data: {
          _id: consultantId,
          name: commandData.name,
          description: commandData.description,
          max_consultants: commandData.max_consultants
        },
        sequence_id: ++eventId
      },
      {
        type: AgencyEventEnum.AGENCY_CONSULTANT_ROLE_ENABLED,
        aggregate_id: aggregate.getId(),
        data: {
          _id: consultantId
        },
        sequence_id: ++eventId
      }
    ]);
  }
}
