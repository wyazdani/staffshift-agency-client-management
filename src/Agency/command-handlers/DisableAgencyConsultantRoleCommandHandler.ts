import {AgencyConsultantRoleDisabledEventStoreDataInterface} from 'EventStoreDataTypes';
import {AgencyRepository} from '../AgencyRepository';
import {AgencyCommandEnum} from '../types';
import {DisableAgencyConsultantRoleCommandDataInterface} from '../types/CommandDataTypes';
import {AgencyCommandHandlerInterface} from '../types/AgencyCommandHandlerInterface';
import {EventsEnum} from '../../Events';

/**
 * Class responsible for handling disableAgencyConsultantRole command
 */
export class DisableAgencyConsultantRoleCommandHandler implements AgencyCommandHandlerInterface {
  public commandType = AgencyCommandEnum.DISABLE_AGENCY_CONSULTANT_ROLE;

  constructor(private agencyRepository: AgencyRepository) {}

  /**
   * Build and save event caused by addAgencyConsultantRole command
   */
  async execute(agencyId: string, commandData: DisableAgencyConsultantRoleCommandDataInterface): Promise<void> {
    const aggregate = await this.agencyRepository.getAggregate(agencyId);
    const eventId = aggregate.getLastEventId();

    if (!aggregate.canDisableConsultantRole(commandData._id)) {
      return;
    }
    await this.agencyRepository.save([
      {
        type: EventsEnum.AGENCY_CONSULTANT_ROLE_DISABLED,
        aggregate_id: aggregate.getId(),
        data: {
          _id: commandData._id
        } as AgencyConsultantRoleDisabledEventStoreDataInterface,
        sequence_id: eventId + 1
      }
    ]);
  }
}
