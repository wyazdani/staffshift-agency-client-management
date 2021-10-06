import {AgencyRepository} from '../AgencyRepository';
import {AgencyCommandHandlerInterface} from '../types/AgencyCommandHandlerInterface';
import {AgencyCommandEnum, AgencyEventEnum} from '../types';
import {UpdateAgencyConsultantRoleCommandDataInterface} from '../types/CommandDataTypes';

/**
 * Class responsible for handling updateAgencyConsultantRole command
 */
export class UpdateAgencyConsultantRoleCommandHandler implements AgencyCommandHandlerInterface {
  public commandType = AgencyCommandEnum.UPDATE_AGENCY_CONSULTANT_ROLE;

  constructor(private agencyRepository: AgencyRepository) {}

  /**
   * Build and save event caused by updateAgencyConsultantRole command
   */
  async execute(agencyId: string, commandData: UpdateAgencyConsultantRoleCommandDataInterface): Promise<void> {
    const aggregate = await this.agencyRepository.getAggregate(agencyId);

    aggregate.validateUpdateConsultantRole(commandData._id);

    const eventId = aggregate.getLastEventId();

    await this.agencyRepository.save([
      {
        type: AgencyEventEnum.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED,
        aggregate_id: aggregate.getId(),
        data: {...commandData},
        sequence_id: eventId + 1
      }
    ]);
  }
}