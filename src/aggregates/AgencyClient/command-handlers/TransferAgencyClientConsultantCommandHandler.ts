import {
  AgencyClientConsultantAssignedEventStoreDataInterface,
  AgencyClientConsultantUnassignedEventStoreDataInterface
} from 'EventTypes';
import {AgencyClientRepository} from '../AgencyClientRepository';
import {AgencyClientCommandHandlerInterface} from '../types/AgencyClientCommandHandlerInterface';
import {AgencyClientCommandEnum} from '../types';
import {EventsEnum} from '../../../Events';
import {TransferAgencyClientConsultantCommandInterface} from '../types/CommandTypes';

/**
 * Class responsible for handling transferAgencyClientConsultant command
 */
export class TransferAgencyClientConsultantCommandHandler implements AgencyClientCommandHandlerInterface {
  public commandType = AgencyClientCommandEnum.TRANSFER_AGENCY_CLIENT_CONSULTANT;

  constructor(private agencyClientRepository: AgencyClientRepository) {}

  /**
   * Build and save events caused by transferAgencyClientConsultant command
   */
  async execute(command: TransferAgencyClientConsultantCommandInterface): Promise<void> {
    const aggregate = await this.agencyClientRepository.getAggregate(command.aggregateId);

    await aggregate.validateTransferClientConsultant(command.data);
    let eventId = aggregate.getLastSequenceId();

    await this.agencyClientRepository.save([
      {
        type: EventsEnum.AGENCY_CLIENT_CONSULTANT_UNASSIGNED,
        aggregate_id: aggregate.getId(),
        data: {
          _id: command.data.from_id
        } as AgencyClientConsultantUnassignedEventStoreDataInterface,
        sequence_id: ++eventId
      },
      {
        type: EventsEnum.AGENCY_CLIENT_CONSULTANT_ASSIGNED,
        aggregate_id: aggregate.getId(),
        data: {
          _id: command.data.to_id,
          consultant_id: command.data.to_consultant_id,
          consultant_role_id: command.data.to_consultant_role_id
        } as AgencyClientConsultantAssignedEventStoreDataInterface,
        sequence_id: ++eventId
      }
    ]);
  }
}
