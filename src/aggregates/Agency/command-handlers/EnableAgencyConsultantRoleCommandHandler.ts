import {AgencyConsultantRoleEnabledEventStoreDataInterface} from 'EventTypes';
import {AgencyRepository} from '../AgencyRepository';
import {AgencyCommandHandlerInterface} from '../types/AgencyCommandHandlerInterface';
import {AgencyAggregateCommandInterface, AgencyCommandEnum} from '../types';
import {EnableAgencyConsultantRoleCommandDataInterface} from '../types/CommandDataTypes';
import {EventsEnum} from '../../../Events';

/**
 * Class responsible for handling enableAgencyConsultantRole command
 */
export class EnableAgencyConsultantRoleCommandHandler implements AgencyCommandHandlerInterface {
  public commandType = AgencyCommandEnum.ENABLE_AGENCY_CONSULTANT_ROLE;

  constructor(private agencyRepository: AgencyRepository) {}

  /**
   * Build and save event caused by enableAgencyConsultantRole command
   */
  async execute(command: AgencyAggregateCommandInterface): Promise<void> {
    const aggregate = await this.agencyRepository.getAggregate(command.aggregateId);
    const seqId = aggregate.getLastSequenceId();
    const commandData = command.data as EnableAgencyConsultantRoleCommandDataInterface;

    if (!aggregate.canEnableConsultantRole(commandData._id)) {
      return;
    }
    await this.agencyRepository.save([
      {
        type: EventsEnum.AGENCY_CONSULTANT_ROLE_ENABLED,
        aggregate_id: aggregate.getId(),
        data: {
          _id: commandData._id
        } as AgencyConsultantRoleEnabledEventStoreDataInterface,
        sequence_id: seqId + 1
      }
    ]);
  }
}
