import {ConsultantJobRepository} from '../ConsultantJobRepository';
import {ConsultantJobCommandHandlerInterface} from '../types/ConsultantJobCommandHandlerInterface';
import {ConsultantJobCommandEnum} from '../types';
import {EventsEnum} from '../../../Events';
import {TransferConsultantCommandInterface} from '../types/CommandTypes';
import {ConsultantJobTransferInitiatedEventInterface} from 'EventTypes/ConsultantJobTransferInitiatedEventInterface';

export class TransferConsultantCommandHandler implements ConsultantJobCommandHandlerInterface {
  public commandType = ConsultantJobCommandEnum.TRANSFER_CONSULTANT;

  constructor(private repository: ConsultantJobRepository) {}

  async execute(command: TransferConsultantCommandInterface): Promise<void> {
    const aggregate = await this.repository.getAggregate(command.aggregateId);

    aggregate.validateTransferConsultant(command.data);
    let eventId = aggregate.getLastSequenceId();

    await this.repository.save([
      {
        type: EventsEnum.CONSULTANT_JOB_TRANSFER_INITIATED,
        aggregate_id: aggregate.getId(),
        data: command.data,
        sequence_id: ++eventId
      } as ConsultantJobTransferInitiatedEventInterface
    ]);
  }
}
