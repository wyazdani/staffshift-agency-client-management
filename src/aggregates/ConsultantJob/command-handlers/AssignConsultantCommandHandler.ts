import {ConsultantJobAssignInitiatedEventStoreDataInterface} from 'EventTypes';
import {ConsultantJobRepository} from '../ConsultantJobRepository';
import {ConsultantJobCommandHandlerInterface} from '../types/ConsultantJobCommandHandlerInterface';
import {AssignConsultantCommandDataInterface} from '../types/CommandDataTypes';
import {ConsultantJobCommandEnum} from '../types';
import {EventsEnum} from '../../../Events';

export class AssignConsultantCommandHandler implements ConsultantJobCommandHandlerInterface {
  public commandType = ConsultantJobCommandEnum.ASSIGN_CONSULTANT;

  constructor(private repository: ConsultantJobRepository) {}

  async execute(agencyId: string, commandData: AssignConsultantCommandDataInterface): Promise<void> {
    const aggregate = await this.repository.getAggregate(agencyId);

    await aggregate.validateAssignConsultant(commandData);
    let eventId = aggregate.getLastEventId();

    await this.repository.save([
      {
        type: EventsEnum.CONSULTANT_JOB_ASSIGN_INITIATED,
        aggregate_id: aggregate.getId(),
        data: commandData as ConsultantJobAssignInitiatedEventStoreDataInterface,
        sequence_id: ++eventId
      }
    ]);
  }
}
