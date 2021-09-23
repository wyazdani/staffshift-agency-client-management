import {AgencyRepository} from '../AgencyRepository';
import {AgencyCommandHandlerInterface} from '../types/AgencyCommandHandlerInterface';
import {AgencyCommandEnum, AgencyEventEnum} from '../types';
import {UpdateAgencyConsultantRoleCommandDataInterface} from '../types/UpdateAgencyConsultantRoleCommandDataInterface';

export class UpdateAgencyConsultantRoleCommandHandler implements AgencyCommandHandlerInterface {
  public commandType = AgencyCommandEnum.UPDATE_AGENCY_CONSULTANT_ROLE;

  constructor(private agencyRepository: AgencyRepository) {}

  async execute(agencyId: string, commandData: UpdateAgencyConsultantRoleCommandDataInterface): Promise<void> {
    const aggregate = await this.agencyRepository.getAggregate(agencyId);
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
