import {WriteProjectionInterface} from 'WriteProjectionInterface';
import {EventsEnum} from '../../Events';
import {EventStoreModelInterface} from '../../models/EventStore';
import {PaymentTermAggregateRecordInterface} from './types';
import {PAYMENT_TERM_ENUM} from './types/PaymentTermAggregateRecordInterface';

/**
 * Responsible for handling all events to build the current state of the aggregate
 */
export class PaymentTermWriteProjectionHandler
implements WriteProjectionInterface<PaymentTermAggregateRecordInterface> {
  execute(
    type: EventsEnum,
    aggregate: PaymentTermAggregateRecordInterface,
    event: EventStoreModelInterface
  ): PaymentTermAggregateRecordInterface {
    switch (type) {
      case EventsEnum.AGENCY_CLIENT_CREDIT_PAYMENT_TERM_APPLIED:
        aggregate.inherited = false;
        aggregate.payment_term = PAYMENT_TERM_ENUM.CREDIT;
        break;
      case EventsEnum.AGENCY_CLIENT_CREDIT_PAYMENT_TERM_INHERITED:
        aggregate.inherited = true;
        aggregate.payment_term = PAYMENT_TERM_ENUM.CREDIT;
        break;
      case EventsEnum.AGENCY_CLIENT_PAY_IN_ADVANCE_PAYMENT_TERM_APPLIED:
        aggregate.payment_term = PAYMENT_TERM_ENUM.PAY_IN_ADVANCE;
        aggregate.inherited = false;
        break;
      case EventsEnum.AGENCY_CLIENT_PAY_IN_ADVANCE_PAYMENT_TERM_INHERITED: {
        aggregate.payment_term = PAYMENT_TERM_ENUM.PAY_IN_ADVANCE;
        aggregate.inherited = true;
        break;
      }
      case EventsEnum.AGENCY_CLIENT_EMPTY_PAYMENT_TERM_INHERITED: {
        aggregate.payment_term = null;
        aggregate.inherited = true;
        break;
      }
      default:
        throw new Error(`Event type not supported: ${type}`);
    }
    return {...aggregate, last_sequence_id: event.sequence_id};
  }
}
