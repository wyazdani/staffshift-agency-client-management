import {EventsEnum} from '../../../Events';
import {ConsultantJobAssignRepository} from '../ConsultantJobAssignRepository';
import {ConsultantJobAssignCommandHandlerInterface} from '../types/ConsultantJobAssignCommandHandlerInterface';
import {ConsultantJobAssignCommandEnum} from '../types';
import {CompleteConsultantJobAssignCommandInterface} from '../types/CommandTypes/CompleteConsultantJobAssignCommandInterface';
import {ConsultantJobAssignProcessCompletedEventInterface} from 'EventTypes/ConsultantJobAssignProcessCompletedEventInterface';

export class CompleteConsultantJobAssignCommandHandler implements ConsultantJobAssignCommandHandlerInterface {
  public commandType = ConsultantJobAssignCommandEnum.COMPLETE;

  constructor(private repository: ConsultantJobAssignRepository) {}

  async execute(command: CompleteConsultantJobAssignCommandInterface): Promise<void> {
    const aggregate = await this.repository.getAggregate(command.aggregateId);

    let eventId = aggregate.getLastEventId();

    await this.repository.save([
      {
        type: EventsEnum.CONSULTANT_JOB_ASSIGN_PROCESS_COMPLETED,
        aggregate_id: aggregate.getId(),
        data: command.data,
        sequence_id: ++eventId
      } as ConsultantJobAssignProcessCompletedEventInterface
    ]);
  }
}
