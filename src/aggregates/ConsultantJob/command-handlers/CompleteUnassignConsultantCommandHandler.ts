import {ConsultantJobRepository} from '../ConsultantJobRepository';
import {ConsultantJobCommandHandlerInterface} from '../types/ConsultantJobCommandHandlerInterface';
import {ConsultantJobCommandEnum} from '../types';
import {EventsEnum} from '../../../Events';
import {CompleteUnassignConsultantCommandInterface} from '../types/CommandTypes';
import {ConsultantJobUnassignCompletedEventInterface} from 'EventTypes/ConsultantJobUnassignCompletedEventInterface';

export class CompleteUnassignConsultantCommandHandler implements ConsultantJobCommandHandlerInterface {
  public commandType = ConsultantJobCommandEnum.COMPLETE_UNASSIGN_CONSULTANT;

  constructor(private repository: ConsultantJobRepository) {}

  async execute(command: CompleteUnassignConsultantCommandInterface): Promise<void> {
    const aggregate = await this.repository.getAggregate(command.aggregateId);

    if (aggregate.validateCompleteJob(command.data._id)) {
      let eventId = aggregate.getLastSequenceId();

      await this.repository.save([
        {
          type: EventsEnum.CONSULTANT_JOB_UNASSIGN_COMPLETED,
          aggregate_id: aggregate.getId(),
          data: command.data,
          sequence_id: ++eventId
        } as ConsultantJobUnassignCompletedEventInterface
      ]);
    }
  }
}
