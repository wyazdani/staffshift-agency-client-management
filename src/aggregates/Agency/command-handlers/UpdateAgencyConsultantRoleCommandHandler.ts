import {AgencyConsultantRoleDetailsUpdatedEventStoreDataInterface} from 'EventTypes';
import {AgencyRepository} from '../AgencyRepository';
import {AgencyCommandHandlerInterface} from '../types/AgencyCommandHandlerInterface';
import {AgencyCommandEnum} from '../types';
import {UpdateAgencyConsultantRoleCommandInterface} from '../types/CommandTypes';
import {EventsEnum} from '../../../Events';

/**
 * Class responsible for handling updateAgencyConsultantRole command
 */
export class UpdateAgencyConsultantRoleCommandHandler implements AgencyCommandHandlerInterface {
  public commandType = AgencyCommandEnum.UPDATE_AGENCY_CONSULTANT_ROLE;

  constructor(private agencyRepository: AgencyRepository) {}

  /**
   * Build and save event caused by updateAgencyConsultantRole command
   */
  async execute(command: UpdateAgencyConsultantRoleCommandInterface): Promise<number> {
    const aggregate = await this.agencyRepository.getAggregate(command.aggregateId);

    aggregate.validateUpdateConsultantRole(command.data._id);

    let eventId = aggregate.getLastSequenceId();

    await this.agencyRepository.save([
      {
        type: EventsEnum.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED,
        aggregate_id: aggregate.getId(),
        data: {...command.data} as AgencyConsultantRoleDetailsUpdatedEventStoreDataInterface,
        sequence_id: ++eventId
      }
    ]);
    return eventId;
  }
}
