import {AgencyClientCreditPaymentTermAppliedEventInterface} from 'EventTypes/AgencyClientCreditPaymentTermAppliedEventInterface';
import {AgencyClientPayInAdvancePaymentTermAppliedEventInterface} from 'EventTypes/AgencyClientPayInAdvancePaymentTermAppliedEventInterface';
import {EventsEnum} from '../../../Events';
import {PaymentTermRepository} from '../PaymentTermRepository';
import {PaymentTermCommandEnum} from '../types';
import {ApplyPaymentTermCommandInterface} from '../types/CommandTypes';
import {PAYMENT_TERM_ENUM} from '../types/PaymentTermAggregateRecordInterface';
import {PaymentTermCommandHandlerInterface} from '../types/PaymentTermCommandHandlerInterface';

export class ApplyPaymentTermCommandHandler implements PaymentTermCommandHandlerInterface {
  public commandType = PaymentTermCommandEnum.APPLY_PAYMENT_TERM;

  constructor(private repository: PaymentTermRepository) {}

  async execute(command: ApplyPaymentTermCommandInterface): Promise<void> {
    const aggregate = await this.repository.getAggregate(command.aggregateId);
    let eventId = aggregate.getLastSequenceId();

    await this.repository.save([
      {
        type:
          command.data.term === PAYMENT_TERM_ENUM.CREDIT
            ? EventsEnum.AGENCY_CLIENT_CREDIT_PAYMENT_TERM_APPLIED
            : EventsEnum.AGENCY_CLIENT_PAY_IN_ADVANCE_PAYMENT_TERM_APPLIED,
        aggregate_id: aggregate.getId(),
        data: {},
        sequence_id: ++eventId
      } as AgencyClientCreditPaymentTermAppliedEventInterface | AgencyClientPayInAdvancePaymentTermAppliedEventInterface
    ]);
  }
}
