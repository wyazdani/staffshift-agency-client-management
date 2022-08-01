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
      case EventsEnum.AGENCY_CLIENT_CREDIT_PAYMENT_TERM_INHERITED:
        aggregate.payment_term = PAYMENT_TERM_ENUM.CREDIT;
        break;
      case EventsEnum.AGENCY_CLIENT_PAY_IN_ADVANCE_PAYMENT_TERM_APPLIED:
      case EventsEnum.AGENCY_CLIENT_PAY_IN_ADVANCE_PAYMENT_TERM_INHERITED: {
        aggregate.payment_term = PAYMENT_TERM_ENUM.PAY_IN_ADVANCE;
        break;
      }
      case EventsEnum.AGENCY_CLIENT_EMPTY_PAYMENT_TERM_INHERITED: {
        aggregate.payment_term = null;
        break;
      }
    }
    switch (type) {
      case EventsEnum.AGENCY_CLIENT_CREDIT_PAYMENT_TERM_APPLIED:
      case EventsEnum.AGENCY_CLIENT_PAY_IN_ADVANCE_PAYMENT_TERM_APPLIED: {
        aggregate.inherited = false;
        break;
      }
      case EventsEnum.AGENCY_CLIENT_EMPTY_PAYMENT_TERM_INHERITED:
      case EventsEnum.AGENCY_CLIENT_CREDIT_PAYMENT_TERM_INHERITED:
      case EventsEnum.AGENCY_CLIENT_PAY_IN_ADVANCE_PAYMENT_TERM_INHERITED: {
        aggregate.inherited = true;
        break;
      }
      default:
        throw new Error(`Event type not supported: ${type}`);
    }
    aggregate.last_event_date = event.created_at;
    return {...aggregate, last_sequence_id: event.sequence_id};
  }
}
