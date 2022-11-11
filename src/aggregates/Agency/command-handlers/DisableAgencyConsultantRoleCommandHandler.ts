import {AgencyConsultantRoleDisabledEventStoreDataInterface} from 'EventTypes';
import {AgencyRepository} from '../AgencyRepository';
import {AgencyCommandEnum} from '../types';
import {DisableAgencyConsultantRoleCommandInterface} from '../types/CommandTypes';
import {AgencyCommandHandlerInterface} from '../types/AgencyCommandHandlerInterface';
import {EventsEnum} from '../../../Events';

/**
 * Class responsible for handling disableAgencyConsultantRole command
 */
export class DisableAgencyConsultantRoleCommandHandler implements AgencyCommandHandlerInterface {
  public commandType = AgencyCommandEnum.DISABLE_AGENCY_CONSULTANT_ROLE;

  constructor(private agencyRepository: AgencyRepository) {}

  /**
   * Build and save event caused by disableAgencyConsultantRole command
   */
  async execute(command: DisableAgencyConsultantRoleCommandInterface): Promise<number> {
    const aggregate = await this.agencyRepository.getAggregate(command.aggregateId);
    let eventId = aggregate.getLastSequenceId();

    if (!aggregate.canDisableConsultantRole(command.data._id)) {
      return;
    }
    await this.agencyRepository.save([
      {
        type: EventsEnum.AGENCY_CONSULTANT_ROLE_DISABLED,
        aggregate_id: aggregate.getId(),
        data: {
          _id: command.data._id
        } as AgencyConsultantRoleDisabledEventStoreDataInterface,
        sequence_id: ++eventId
      }
    ]);
    return eventId;
  }
}
