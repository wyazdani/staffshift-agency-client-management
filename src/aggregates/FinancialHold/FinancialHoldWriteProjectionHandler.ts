import {WriteProjectionInterface} from 'WriteProjectionInterface';
import {EventsEnum} from '../../Events';
import {EventStoreModelInterface} from '../../models/EventStore';
import {FinancialHoldAggregateRecordInterface} from './types';

/**
 * Responsible for handling all events to build the current state of the aggregate
 */
export class FinancialHoldWriteProjectionHandler
implements WriteProjectionInterface<FinancialHoldAggregateRecordInterface> {
  execute(
    type: EventsEnum,
    aggregate: FinancialHoldAggregateRecordInterface,
    event: EventStoreModelInterface
  ): FinancialHoldAggregateRecordInterface {
    switch (type) {
      case EventsEnum.AGENCY_CLIENT_FINANCIAL_HOLD_APPLIED:
        aggregate.inherited = false;
        aggregate.financial_hold = true;
        break;
      case EventsEnum.AGENCY_CLIENT_FINANCIAL_HOLD_CLEARED:
        aggregate.inherited = false;
        aggregate.financial_hold = false;
        break;
      case EventsEnum.AGENCY_CLIENT_CLEAR_FINANCIAL_HOLD_INHERITED:
        aggregate.inherited = true;
        aggregate.financial_hold = false;
        break;
      case EventsEnum.AGENCY_CLIENT_FINANCIAL_HOLD_INHERITED: {
        aggregate.inherited = true;
        aggregate.financial_hold = true;
        break;
      }
      case EventsEnum.AGENCY_CLIENT_EMPTY_FINANCIAL_HOLD_INHERITED: {
        aggregate.inherited = true;
        aggregate.financial_hold = null;
        break;
      }
      default:
        throw new Error(`Event type not supported: ${type}`);
    }
    return {...aggregate, last_sequence_id: event.sequence_id};
  }
}
