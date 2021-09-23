import {AgencyRepository} from '../AgencyRepository';
import {AgencyCommandHandlerInterface} from '../types/AgencyCommandHandlerInterface';
import {AgencyCommandEnum, AgencyEventEnum} from '../types';
import {EnableAgencyConsultantRoleCommandDataInterface} from '../types/EnableAgencyConsultantRoleCommandDataInterface';

export class EnableAgencyConsultantRoleCommandHandler implements AgencyCommandHandlerInterface {
  public commandType = AgencyCommandEnum.ENABLE_AGENCY_CONSULTANT_ROLE;

  constructor(private agencyRepository: AgencyRepository) {}

  async execute(agencyId: string, commandData: EnableAgencyConsultantRoleCommandDataInterface): Promise<void> {
    const aggregate = await this.agencyRepository.getAggregate(agencyId);
    const eventId = aggregate.getLastEventId();

    if (!aggregate.canEnableConsultantRole(commandData._id)) {
      return;
    }
    await this.agencyRepository.save([
      {
        type: AgencyEventEnum.AGENCY_CONSULTANT_ROLE_ENABLED,
        aggregate_id: aggregate.getId(),
        data: {
          _id: commandData._id
        },
        sequence_id: eventId + 1
      }
    ]);
  }
}
