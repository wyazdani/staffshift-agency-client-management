import {AgencyClientClearFinancialHoldInheritedEventStoreDataInterface} from 'EventTypes/AgencyClientClearFinancialHoldInheritedEventInterface';
import {AgencyClientFinancialHoldAppliedEventStoreDataInterface} from 'EventTypes/AgencyClientFinancialHoldAppliedEventInterface';
import {AgencyClientFinancialHoldClearedEventStoreDataInterface} from 'EventTypes/AgencyClientFinancialHoldClearedEventInterface';
import {AgencyClientFinancialHoldInheritedEventStoreDataInterface} from 'EventTypes/AgencyClientFinancialHoldInheritedEventInterface';
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
        aggregate.note = (event.data as AgencyClientFinancialHoldAppliedEventStoreDataInterface).note;
        break;
      case EventsEnum.AGENCY_CLIENT_FINANCIAL_HOLD_CLEARED:
        aggregate.inherited = false;
        aggregate.financial_hold = false;
        aggregate.note = (event.data as AgencyClientFinancialHoldClearedEventStoreDataInterface).note;
        break;
      case EventsEnum.AGENCY_CLIENT_CLEAR_FINANCIAL_HOLD_INHERITED:
        aggregate.inherited = true;
        aggregate.financial_hold = false;
        aggregate.note = (event.data as AgencyClientClearFinancialHoldInheritedEventStoreDataInterface).note;
        break;
      case EventsEnum.AGENCY_CLIENT_FINANCIAL_HOLD_INHERITED: {
        aggregate.inherited = true;
        aggregate.financial_hold = true;
        aggregate.note = (event.data as AgencyClientFinancialHoldInheritedEventStoreDataInterface).note;
        break;
      }
      case EventsEnum.AGENCY_CLIENT_EMPTY_FINANCIAL_HOLD_INHERITED: {
        aggregate.inherited = true;
        aggregate.financial_hold = null;
        aggregate.note = null;
        break;
      }
      default:
        throw new Error(`Event type not supported: ${type}`);
    }
    aggregate.last_event_date = event.created_at;
    return {...aggregate, last_sequence_id: event.sequence_id};
  }
}
