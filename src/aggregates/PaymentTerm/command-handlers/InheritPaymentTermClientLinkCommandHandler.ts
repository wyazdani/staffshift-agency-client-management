import {AgencyClientCreditPaymentTermInheritedEventInterface} from 'EventTypes/AgencyClientCreditPaymentTermInheritedEventInterface';
import {AgencyClientEmptyPaymentTermInheritedEventInterface} from 'EventTypes/AgencyClientEmptyPaymentTermInheritedEventInterface';
import {AgencyClientPayInAdvancePaymentTermInheritedEventInterface} from 'EventTypes/AgencyClientPayInAdvancePaymentTermInheritedEventInterface';
import {PaymentTermRepository} from '../PaymentTermRepository';
import {PAYMENT_TERM_ENUM} from '../types/PaymentTermAggregateRecordInterface';
import {PaymentTermCommandHandlerInterface} from '../types/PaymentTermCommandHandlerInterface';
import {PaymentTermCommandEnum} from '../types';
import {EventsEnum} from '../../../Events';
import {InheritPaymentTermClientLinkCommandInterface} from '../types/CommandTypes';

export class InheritPaymentTermClientLinkCommandHandler implements PaymentTermCommandHandlerInterface {
  public commandType = PaymentTermCommandEnum.INHERIT_PAYMENT_TERM_CLIENT_LINK;

  constructor(private repository: PaymentTermRepository) {}
  /**
   * The command used when a new agency client link event is received
   *
   * We should mimic the same logic as apply_inherit_payment_term command
   * The idea is to check if the client had configuration before the new link?
   * if the new payment term we are applying is `null` and the payment term aggregate of client is empty, we will not
   * insert emptyInherited event for the client because it doesn't make sense for business
   *
   * issue: https://github.com/A24Group/staffshift-agency-client-management/issues/257
   */
  async execute(command: InheritPaymentTermClientLinkCommandInterface): Promise<void> {
    const aggregate = await this.repository.getAggregate(command.aggregateId);

    let type: string;

    if (command.data.term === PAYMENT_TERM_ENUM.CREDIT) {
      type = EventsEnum.AGENCY_CLIENT_CREDIT_PAYMENT_TERM_INHERITED;
    } else if (command.data.term === PAYMENT_TERM_ENUM.PAY_IN_ADVANCE) {
      type = EventsEnum.AGENCY_CLIENT_PAY_IN_ADVANCE_PAYMENT_TERM_INHERITED;
    } else {
      if (aggregate.getLastSequenceId() === 0) {
        /**
         * It should be fine that we are doing nothing, even if we read from secondary and we are behind master
         * that's fine. because we will be behind on secondary even in the event listener to do this check
         */
        return;
      }
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
  }
}
