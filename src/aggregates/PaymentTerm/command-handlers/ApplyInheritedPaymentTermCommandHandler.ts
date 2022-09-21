import {AgencyClientCreditPaymentTermInheritedEventInterface} from 'EventTypes/AgencyClientCreditPaymentTermInheritedEventInterface';
import {AgencyClientEmptyPaymentTermInheritedEventInterface} from 'EventTypes/AgencyClientEmptyPaymentTermInheritedEventInterface';
import {AgencyClientPayInAdvancePaymentTermInheritedEventInterface} from 'EventTypes/AgencyClientPayInAdvancePaymentTermInheritedEventInterface';
import {PaymentTermRepository} from '../PaymentTermRepository';
import {PAYMENT_TERM_ENUM} from '../types/PaymentTermAggregateRecordInterface';
import {PaymentTermCommandHandlerInterface} from '../types/PaymentTermCommandHandlerInterface';
import {PaymentTermCommandEnum} from '../types';
import {EventsEnum} from '../../../Events';
import {ApplyInheritedPaymentTermCommandInterface} from '../types/CommandTypes';

export class ApplyInheritedPaymentTermCommandHandler implements PaymentTermCommandHandlerInterface {
  public commandType = PaymentTermCommandEnum.APPLY_INHERITED_PAYMENT_TERM;

  constructor(private repository: PaymentTermRepository) {}

  /**
   * when force is true, inherited events will be persisted, it means if the node is not inherited, then we will mark it as inherited
   * but if the force is false, it means we have to check if the node is inherited or no. if no throw an exception
   */
  async execute(command: ApplyInheritedPaymentTermCommandInterface): Promise<number> {
    const aggregate = await this.repository.getAggregate(command.aggregateId);

    if (!command.data.force) {
      aggregate.validateInherited();
    }
    let type: string;

    if (command.data.term === PAYMENT_TERM_ENUM.CREDIT) {
      type = EventsEnum.AGENCY_CLIENT_CREDIT_PAYMENT_TERM_INHERITED;
    } else if (command.data.term === PAYMENT_TERM_ENUM.PAY_IN_ADVANCE) {
      type = EventsEnum.AGENCY_CLIENT_PAY_IN_ADVANCE_PAYMENT_TERM_INHERITED;
    } else {
      type = EventsEnum.AGENCY_CLIENT_EMPTY_PAYMENT_TERM_INHERITED;
    }

    let eventId = aggregate.getLastSequenceId();

    await this.repository.save([
      {
        type,
        aggregate_id: aggregate.getId(),
        data: {},
        sequence_id: ++eventId
      } as
        | AgencyClientCreditPaymentTermInheritedEventInterface
        | AgencyClientPayInAdvancePaymentTermInheritedEventInterface
        | AgencyClientEmptyPaymentTermInheritedEventInterface
    ]);
    return eventId;
  }
}
