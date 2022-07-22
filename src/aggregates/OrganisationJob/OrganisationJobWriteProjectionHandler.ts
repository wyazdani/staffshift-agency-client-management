import {WriteProjectionInterface} from 'WriteProjectionInterface';
import {EventsEnum} from '../../Events';
import {EventStoreModelInterface} from '../../models/EventStore';
import {OrganisationJobAggregateRecordInterface} from './types';
import {
  CompleteApplyPaymentTermCommandDataInterface,
  CompleteInheritPaymentTermCommandDataInterface,
  InitiateApplyPaymentTermCommandDataInterface,
  InitiateInheritPaymentTermCommandDataInterface
} from './types/CommandTypes';

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
    switch (type) {
      case EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_INITIATED: {
        const eventData = event.data as InitiateApplyPaymentTermCommandDataInterface;

        aggregate.running_apply_payment_term.push({
          job_id: eventData._id
        });
        aggregate.payment_terms[eventData._id] = 'started';
        return {...aggregate, last_sequence_id: event.sequence_id};
      }
      case EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_INHERITANCE_INITIATED: {
        const eventData = event.data as InitiateInheritPaymentTermCommandDataInterface;

        aggregate.running_apply_payment_term_inheritance.push({
          job_id: eventData._id
        });
        aggregate.payment_terms[eventData._id] = 'started';
        return {...aggregate, last_sequence_id: event.sequence_id};
      }
      case EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_COMPLETED: {
        const eventData = event.data as CompleteApplyPaymentTermCommandDataInterface;

        aggregate.running_apply_payment_term.push({
          job_id: eventData._id
        });
        aggregate.payment_terms[eventData._id] = 'completed';
        return {...aggregate, last_sequence_id: event.sequence_id};
      }
      case EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_INHERITANCE_COMPLETED: {
        const eventData = event.data as CompleteInheritPaymentTermCommandDataInterface;

        aggregate.running_apply_payment_term_inheritance.push({
          job_id: eventData._id
        });
        aggregate.payment_terms[eventData._id] = 'completed';
        return {...aggregate, last_sequence_id: event.sequence_id};
      }
      default:
        throw new Error(`Event type not supported: ${type}`);
    }
  }
}
