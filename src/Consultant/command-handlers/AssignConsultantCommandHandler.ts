import {
  AgencyConsultantRoleAddedEventStoreDataInterface,
  AgencyConsultantRoleEnabledEventStoreDataInterface
} from 'EventStoreDataTypes';
import {AgencyRepository} from '../AgencyRepository';
import {ConsultantRepository} from '../ConsultantRepository';
import {AgencyCommandHandlerInterface} from '../types/AgencyCommandHandlerInterface';
import {
  AddAgencyConsultantRoleCommandDataInterface,
  AssignConsultantCommandDataInterface
} from '../types/CommandDataTypes';
import {ConsultantCommandEnum} from '../types';
import {EventsEnum} from '../../Events';

export class AssignConsultantCommandHandler implements AgencyCommandHandlerInterface {
  public commandType = ConsultantCommandEnum.ASSIGN_CONSULTANT;

  constructor(private repository: ConsultantRepository) {}

  async execute(agencyId: string, commandData: AssignConsultantCommandDataInterface): Promise<void> {
    const aggregate = await this.repository.getAggregate(agencyId);
    let eventId = aggregate.getLastEventId();
    await this.agencyRepository.save([
      {
        type: EventsEnum.AGENCY_CONSULTANT_ROLE_ADDED,
        aggregate_id: aggregate.getId(),
        data: {
          _id: commandData._id,
          name: commandData.name,
          description: commandData.description,
          max_consultants: commandData.max_consultants
        } as AgencyConsultantRoleAddedEventStoreDataInterface,
        sequence_id: ++eventId
      },
      {
        type: EventsEnum.AGENCY_CONSULTANT_ROLE_ENABLED,
        aggregate_id: aggregate.getId(),
        data: {
          _id: commandData._id
        } as AgencyConsultantRoleEnabledEventStoreDataInterface,
        sequence_id: ++eventId
      }
    ]);
  }
}
