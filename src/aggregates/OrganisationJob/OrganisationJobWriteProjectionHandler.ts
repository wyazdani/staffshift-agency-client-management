import {WriteProjectionInterface} from 'WriteProjectionInterface';
import {EventsEnum} from '../../Events';
import {remove, has} from 'lodash';
import {EventStoreModelInterface} from '../../models/EventStore';
import {OrganisationJobAggregateRecordInterface} from './types';
import {
  CompleteApplyFinancialHoldCommandDataInterface,
  CompleteApplyPaymentTermCommandDataInterface,
  CompleteClearFinancialHoldCommandDataInterface,
  CompleteInheritPaymentTermCommandDataInterface,
  InitiateApplyFinancialHoldCommandDataInterface,
  InitiateApplyPaymentTermCommandDataInterface,
  InitiateClearFinancialHoldCommandDataInterface,
  InitiateInheritPaymentTermCommandDataInterface
} from './types/CommandTypes';
import {FinancialHoldEnum, PaymentTermEnum} from './types/OrganisationJobAggregateRecordInterface';

/**
 * Responsible for handling all events to build the current state of the aggregate
 */
export class OrganisationJobWriteProjectionHandler
implements WriteProjectionInterface<OrganisationJobAggregateRecordInterface> {
  execute(
    type: EventsEnum,
    aggregate: OrganisationJobAggregateRecordInterface,
    event: EventStoreModelInterface
  ): OrganisationJobAggregateRecordInterface {
    if (!has(aggregate, 'payment_term_jobs')) {
      aggregate.payment_term_jobs = {};
    }
    if (!has(aggregate, 'financial_hold_jobs')) {
      aggregate.financial_hold_jobs = {};
    }
    if (!has(aggregate, 'financial_hold_type')) {
      aggregate.financial_hold_type = {};
    }
    switch (type) {
      case EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_INITIATED: {
        const eventData = event.data as InitiateApplyPaymentTermCommandDataInterface;

        aggregate.payment_term_jobs[eventData._id] = PaymentTermEnum.STARTED;

        return {...aggregate, last_sequence_id: event.sequence_id};
      }
      case EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_INHERITANCE_INITIATED: {
        const eventData = event.data as InitiateInheritPaymentTermCommandDataInterface;

        aggregate.payment_term_jobs[eventData._id] = PaymentTermEnum.STARTED_INHERITED;

        return {...aggregate, last_sequence_id: event.sequence_id};
      }
      case EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_COMPLETED: {
        const eventData = event.data as CompleteApplyPaymentTermCommandDataInterface;

        aggregate.payment_term_jobs[eventData._id] = PaymentTermEnum.COMPLETED;
        return {...aggregate, last_sequence_id: event.sequence_id};
      }
      case EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_INHERITANCE_COMPLETED: {
        const eventData = event.data as CompleteInheritPaymentTermCommandDataInterface;

        aggregate.payment_term_jobs[eventData._id] = PaymentTermEnum.COMPLETED_INHERITED;
        return {...aggregate, last_sequence_id: event.sequence_id};
      }
      case EventsEnum.AGENCY_CLIENT_APPLY_FINANCIAL_HOLD_INITIATED: {
        const eventData = event.data as InitiateApplyFinancialHoldCommandDataInterface;

        aggregate.financial_hold_jobs[eventData._id] = FinancialHoldEnum.STARTED;
        aggregate.financial_hold_type[eventData._id] = FinancialHoldEnum.APPLIED;
        return {...aggregate, last_sequence_id: event.sequence_id};
      }
      case EventsEnum.AGENCY_CLIENT_APPLY_FINANCIAL_HOLD_COMPLETED: {
        const eventData = event.data as CompleteApplyFinancialHoldCommandDataInterface;

        aggregate.financial_hold_jobs[eventData._id] = FinancialHoldEnum.COMPLETED;
        return {...aggregate, last_sequence_id: event.sequence_id};
      }
      case EventsEnum.AGENCY_CLIENT_CLEAR_FINANCIAL_HOLD_INITIATED: {
        const eventData = event.data as InitiateClearFinancialHoldCommandDataInterface;

        aggregate.financial_hold_jobs[eventData._id] = FinancialHoldEnum.STARTED;
        aggregate.financial_hold_type[eventData._id] = FinancialHoldEnum.CLEARED;
        return {...aggregate, last_sequence_id: event.sequence_id};
      }
      case EventsEnum.AGENCY_CLIENT_CLEAR_FINANCIAL_HOLD_COMPLETED: {
        const eventData = event.data as CompleteClearFinancialHoldCommandDataInterface;

        aggregate.financial_hold_jobs[eventData._id] = FinancialHoldEnum.COMPLETED;
        return {...aggregate, last_sequence_id: event.sequence_id};
      }
      case EventsEnum.AGENCY_CLIENT_APPLY_FINANCIAL_HOLD_INHERITANCE_INITIATED: {
        const eventData = event.data as InitiateClearFinancialHoldCommandDataInterface;

        aggregate.financial_hold_jobs[eventData._id] = FinancialHoldEnum.STARTED;
        aggregate.financial_hold_type[eventData._id] = FinancialHoldEnum.APPLY_INHERITED;
        return {...aggregate, last_sequence_id: event.sequence_id};
      }
      case EventsEnum.AGENCY_CLIENT_APPLY_FINANCIAL_HOLD_INHERITANCE_COMPLETED: {
        const eventData = event.data as InitiateClearFinancialHoldCommandDataInterface;

        aggregate.financial_hold_jobs[eventData._id] = FinancialHoldEnum.COMPLETED;
        return {...aggregate, last_sequence_id: event.sequence_id};
      }
      default:
        throw new Error(`Event type not supported: ${type}`);
    }
  }
}
