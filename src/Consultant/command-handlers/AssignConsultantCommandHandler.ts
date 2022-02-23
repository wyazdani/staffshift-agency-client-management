import {ConsultantAssignInitiatedEventStoreDataInterface} from 'EventStoreDataTypes/ConsultantAssignInitiatedEventStoreDataInterface';
import {ConsultantRepository} from '../ConsultantRepository';
import {ConsultantCommandHandlerInterface} from '../types/ConsultantCommandHandlerInterface';
import {AssignConsultantCommandDataInterface} from '../types/CommandDataTypes';
import {ConsultantCommandEnum} from '../types';
import {EventsEnum} from '../../Events';

export class AssignConsultantCommandHandler implements ConsultantCommandHandlerInterface {
  public commandType = ConsultantCommandEnum.ASSIGN_CONSULTANT;

  constructor(private repository: ConsultantRepository) {}

  async execute(agencyId: string, commandData: AssignConsultantCommandDataInterface): Promise<void> {
    const aggregate = await this.repository.getAggregate(agencyId);

    await aggregate.validateAssignConsultant(commandData);
    let eventId = aggregate.getLastEventId();

    await this.repository.save([
      {
        type: EventsEnum.CONSULTANT_ASSIGN_INITIATED,
        aggregate_id: aggregate.getId(),
        data: commandData as ConsultantAssignInitiatedEventStoreDataInterface,
        sequence_id: ++eventId
      }
    ]);
  }
}
