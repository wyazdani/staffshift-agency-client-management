import {WriteProjectionInterface} from 'WriteProjectionInterface';
import {EventsEnum} from '../../Events';
import {has} from 'lodash';
import {EventStoreModelInterface} from '../../models/EventStore';
import {OrganisationJobAggregateRecordInterface} from './types';
import {FinancialHoldEnum, PaymentTermEnum} from './types/OrganisationJobAggregateRecordInterface';
import {
  AgencyClientApplyPaymentTermInitiatedEventInterface,
  AgencyClientApplyPaymentTermInitiatedEventStoreDataInterface
} from 'EventTypes/AgencyClientApplyPaymentTermInitiatedEventInterface';
import {
  AgencyClientApplyPaymentTermInheritanceInitiatedEventInterface,
  AgencyClientApplyPaymentTermInheritanceInitiatedEventStoreDataInterface
} from 'EventTypes/AgencyClientApplyPaymentTermInheritanceInitiatedEventInterface';
import {
  AgencyClientApplyPaymentTermCompletedEventInterface,
  AgencyClientApplyPaymentTermCompletedEventStoreDataInterface
} from 'EventTypes/AgencyClientApplyPaymentTermCompletedEventInterface';
import {
  AgencyClientApplyFinancialHoldCompletedEventInterface,
  AgencyClientApplyFinancialHoldInheritanceCompletedEventInterface,
  AgencyClientApplyFinancialHoldInheritanceInitiatedEventInterface,
  AgencyClientApplyFinancialHoldInitiatedEventInterface,
  AgencyClientClearFinancialHoldCompletedEventInterface,
  AgencyClientClearFinancialHoldInitiatedEventInterface
} from 'EventTypes';
import {AgencyClientApplyFinancialHoldInitiatedEventStoreDataInterface} from 'EventTypes/AgencyClientApplyFinancialHoldInitiatedEventInterface';
import {AgencyClientApplyFinancialHoldCompletedEventStoreDataInterface} from 'EventTypes/AgencyClientApplyFinancialHoldCompletedEventInterface';
import {AgencyClientClearFinancialHoldInitiatedEventStoreDataInterface} from 'EventTypes/AgencyClientClearFinancialHoldInitiatedEventInterface';
import {AgencyClientClearFinancialHoldCompletedEventStoreDataInterface} from 'EventTypes/AgencyClientClearFinancialHoldCompletedEventInterface';
import {AgencyClientApplyFinancialHoldInheritanceInitiatedEventStoreDataInterface} from 'EventTypes/AgencyClientApplyFinancialHoldInheritanceInitiatedEventInterface';
import {AgencyClientApplyFinancialHoldInheritanceCompletedEventStoreDataInterface} from 'EventTypes/AgencyClientApplyFinancialHoldInheritanceCompletedEventInterface';

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
    switch (type) {
      case EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_INITIATED: {
        const eventData = event.data as AgencyClientApplyPaymentTermInitiatedEventStoreDataInterface;

        aggregate.payment_term_jobs[eventData._id] = PaymentTermEnum.STARTED;

        return {...aggregate, last_sequence_id: event.sequence_id};
      }
      case EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_INHERITANCE_INITIATED: {
        const eventData = event.data as AgencyClientApplyPaymentTermInheritanceInitiatedEventStoreDataInterface;

        aggregate.payment_term_jobs[eventData._id] = PaymentTermEnum.STARTED_INHERITED;

        return {...aggregate, last_sequence_id: event.sequence_id};
      }
      case EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_COMPLETED: {
        const eventData = event.data as AgencyClientApplyPaymentTermCompletedEventStoreDataInterface;

        aggregate.payment_term_jobs[eventData._id] = PaymentTermEnum.COMPLETED;
        return {...aggregate, last_sequence_id: event.sequence_id};
      }
      case EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_INHERITANCE_COMPLETED: {
        const eventData = event.data as AgencyClientApplyPaymentTermInheritanceInitiatedEventStoreDataInterface;

        aggregate.payment_term_jobs[eventData._id] = PaymentTermEnum.COMPLETED_INHERITED;
        return {...aggregate, last_sequence_id: event.sequence_id};
      }
      case EventsEnum.AGENCY_CLIENT_APPLY_FINANCIAL_HOLD_INITIATED: {
        const eventData = event.data as AgencyClientApplyFinancialHoldInitiatedEventStoreDataInterface;

        aggregate.financial_hold_jobs[eventData._id] = {
          status: FinancialHoldEnum.STARTED,
          type: FinancialHoldEnum.APPLIED
        };
        return {...aggregate, last_sequence_id: event.sequence_id};
      }
      case EventsEnum.AGENCY_CLIENT_APPLY_FINANCIAL_HOLD_COMPLETED: {
        const eventData = event.data as AgencyClientApplyFinancialHoldCompletedEventStoreDataInterface;

        aggregate.financial_hold_jobs[eventData._id].status = FinancialHoldEnum.COMPLETED;
        return {...aggregate, last_sequence_id: event.sequence_id};
      }
      case EventsEnum.AGENCY_CLIENT_CLEAR_FINANCIAL_HOLD_INITIATED: {
        const eventData = event.data as AgencyClientClearFinancialHoldInitiatedEventStoreDataInterface;

        aggregate.financial_hold_jobs[eventData._id] = {
          status: FinancialHoldEnum.STARTED,
          type: FinancialHoldEnum.CLEARED
        };
        return {...aggregate, last_sequence_id: event.sequence_id};
      }
      case EventsEnum.AGENCY_CLIENT_CLEAR_FINANCIAL_HOLD_COMPLETED: {
        const eventData = event.data as AgencyClientClearFinancialHoldCompletedEventStoreDataInterface;

        aggregate.financial_hold_jobs[eventData._id].status = FinancialHoldEnum.COMPLETED;
        return {...aggregate, last_sequence_id: event.sequence_id};
      }
      case EventsEnum.AGENCY_CLIENT_APPLY_FINANCIAL_HOLD_INHERITANCE_INITIATED: {
        const eventData = event.data as AgencyClientApplyFinancialHoldInheritanceInitiatedEventStoreDataInterface;

        aggregate.financial_hold_jobs[eventData._id] = {
          status: FinancialHoldEnum.STARTED,
          type: FinancialHoldEnum.APPLY_INHERITED
        };
        return {...aggregate, last_sequence_id: event.sequence_id};
      }
      case EventsEnum.AGENCY_CLIENT_APPLY_FINANCIAL_HOLD_INHERITANCE_COMPLETED: {
        const eventData = event.data as AgencyClientApplyFinancialHoldInheritanceCompletedEventStoreDataInterface;

        aggregate.financial_hold_jobs[eventData._id].status = FinancialHoldEnum.COMPLETED;
        return {...aggregate, last_sequence_id: event.sequence_id};
      }
      default:
        throw new Error(`Event type not supported: ${type}`);
    }
  }
}
