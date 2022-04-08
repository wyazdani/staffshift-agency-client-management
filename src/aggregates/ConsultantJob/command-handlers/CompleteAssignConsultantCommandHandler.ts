import {ConsultantJobRepository} from '../ConsultantJobRepository';
import {ConsultantJobCommandHandlerInterface} from '../types/ConsultantJobCommandHandlerInterface';
import {ConsultantJobCommandEnum} from '../types';
import {EventsEnum} from '../../../Events';
import {CompleteAssignConsultantCommandInterface} from '../types/CommandTypes';
import {ConsultantJobAssignCompletedEventInterface} from 'EventTypes/ConsultantJobAssignCompletedEventInterface';

export class CompleteAssignConsultantCommandHandler implements ConsultantJobCommandHandlerInterface {
  public commandType = ConsultantJobCommandEnum.COMPLETE_ASSIGN_CONSULTANT;

  constructor(private repository: ConsultantJobRepository) {}

  async execute(command: CompleteAssignConsultantCommandInterface): Promise<void> {
    const aggregate = await this.repository.getAggregate(command.aggregateId);

    if (aggregate.validateCompleteJob(command.data._id)) {
      let eventId = aggregate.getLastSequenceId();

      await this.repository.save([
        {
          type: EventsEnum.CONSULTANT_JOB_ASSIGN_COMPLETED,
          aggregate_id: aggregate.getId(),
          data: command.data,
          sequence_id: ++eventId
        } as ConsultantJobAssignCompletedEventInterface
      ]);
    }
  }
}
