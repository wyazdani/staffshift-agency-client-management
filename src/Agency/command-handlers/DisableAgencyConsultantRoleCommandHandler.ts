import {AgencyRepository} from '../AgencyRepository';
import {AgencyCommandEnum, AgencyEventEnum} from '../types';
import {DisableAgencyConsultantRoleCommandDataInterface} from '../types/DisableAgencyConsultantRoleCommandDataInterface';
import {AgencyCommandHandlerInterface} from '../types/AgencyCommandHandlerInterface';

export class DisableAgencyConsultantRoleCommandHandler implements AgencyCommandHandlerInterface {
  public commandType = AgencyCommandEnum.DISABLE_AGENCY_CONSULTANT_ROLE;

  constructor(private agencyRepository: AgencyRepository) {}

  async execute(agencyId: string, commandData: DisableAgencyConsultantRoleCommandDataInterface): Promise<void> {
    const aggregate = await this.agencyRepository.getAggregate(agencyId);
    const eventId = aggregate.getLastEventId();

    if (!aggregate.canDisableConsultantRole(commandData._id)) {
      return;
    }
    await this.agencyRepository.save([
      {
        type: AgencyEventEnum.AGENCY_CONSULTANT_ROLE_DISABLED,
        aggregate_id: aggregate.getId(),
        data: {
          _id: commandData._id
        },
        sequence_id: eventId + 1
      }
    ]);
  }
}
