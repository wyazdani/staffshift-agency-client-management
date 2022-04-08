import {ConsultantJobAssignInitiatedEventStoreDataInterface} from 'EventTypes';
import {ConsultantJobRepository} from '../ConsultantJobRepository';
import {ConsultantJobCommandHandlerInterface} from '../types/ConsultantJobCommandHandlerInterface';
import {ConsultantJobCommandEnum} from '../types';
import {EventsEnum} from '../../../Events';
import {AssignConsultantCommandInterface} from '../types/CommandTypes';
import {ConsultantJobAssignInitiatedEventInterface} from 'EventTypes/ConsultantJobAssignInitiatedEventInterface';

export class AssignConsultantCommandHandler implements ConsultantJobCommandHandlerInterface {
  public commandType = ConsultantJobCommandEnum.ASSIGN_CONSULTANT;

  constructor(private repository: ConsultantJobRepository) {}

  async execute(command: AssignConsultantCommandInterface): Promise<void> {
    const aggregate = await this.repository.getAggregate(command.aggregateId);

    await aggregate.validateAssignConsultant(command.data);
    let eventId = aggregate.getLastSequenceId();

    await this.repository.save([
      {
        type: EventsEnum.CONSULTANT_JOB_ASSIGN_INITIATED,
        aggregate_id: aggregate.getId(),
        data: command.data,
        sequence_id: ++eventId
      } as ConsultantJobAssignInitiatedEventInterface
    ]);
  }
}
