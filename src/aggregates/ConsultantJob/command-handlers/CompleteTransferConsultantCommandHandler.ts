import {ConsultantJobRepository} from '../ConsultantJobRepository';
import {ConsultantJobCommandHandlerInterface} from '../types/ConsultantJobCommandHandlerInterface';
import {ConsultantJobCommandEnum} from '../types';
import {EventsEnum} from '../../../Events';
import {CompleteTransferConsultantCommandInterface} from '../types/CommandTypes';
import {ConsultantJobTransferCompletedEventInterface} from 'EventTypes/ConsultantJobTransferCompletedEventInterface';

export class CompleteTransferConsultantCommandHandler implements ConsultantJobCommandHandlerInterface {
  public commandType = ConsultantJobCommandEnum.COMPLETE_TRANSFER_CONSULTANT;

  constructor(private repository: ConsultantJobRepository) {}

  async execute(command: CompleteTransferConsultantCommandInterface): Promise<void> {
    const aggregate = await this.repository.getAggregate(command.aggregateId);

    if (aggregate.validateCompleteJob(command.data._id)) {
      let eventId = aggregate.getLastSequenceId();

      await this.repository.save([
        {
          type: EventsEnum.CONSULTANT_JOB_TRANSFER_COMPLETED,
          aggregate_id: aggregate.getId(),
          data: command.data,
          sequence_id: ++eventId
        } as ConsultantJobTransferCompletedEventInterface
      ]);
    }
  }
}
