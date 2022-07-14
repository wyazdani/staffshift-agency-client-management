import {PaymentTermRepository} from '../PaymentTermRepository';
import {PaymentTermCommandHandlerInterface} from '../types/PaymentTermCommandHandlerInterface';
import {PaymentTermCommandEnum} from '../types';
import {EventsEnum} from '../../../Events';
import {ApplyInheritedPaymentTermCommandInterface} from '../types/CommandTypes';
import {PaymentTermAssignCompletedEventInterface} from 'EventTypes/PaymentTermAssignCompletedEventInterface';

export class ApplyInheritedPaymentTermCommandHandler implements PaymentTermCommandHandlerInterface {
  public commandType = PaymentTermCommandEnum.APPLY_INHERITED_PAYMENT_TERM;

  constructor(private repository: PaymentTermRepository) {}

  async execute(command: ApplyInheritedPaymentTermCommandInterface): Promise<void> {
    const aggregate = await this.repository.getAggregate(command.aggregateId);

    if (aggregate.validateCompleteJob(command.data._id)) {
      let eventId = aggregate.getLastSequenceId();

      await this.repository.save([
        {
          type: EventsEnum.CONSULTANT_JOB_ASSIGN_COMPLETED,
          aggregate_id: aggregate.getId(),
          data: command.data,
          sequence_id: ++eventId
        } as PaymentTermAssignCompletedEventInterface
      ]);
    }
  }
}
