import {WriteProjectionInterface} from 'WriteProjectionInterface';
import {EventsEnum} from '../../Events';
import {EventStoreModelInterface} from '../../models/EventStore';
import {OrganisationJobAggregateRecordInterface} from './types';

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
        aggregate.running_apply_payment_term.push({
          job_id: event.id
        });
        return {...aggregate, last_sequence_id: event.sequence_id};
      }
      case EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_INHERITANCE_INITIATED: {
        aggregate.running_apply_payment_term_inheritance.push({
          job_id: event.id
        });
        return {...aggregate, last_sequence_id: event.sequence_id};
      }
      case EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_COMPLETED: {
        aggregate.running_apply_payment_term.push({
          job_id: event.id
        });
        return {...aggregate, last_sequence_id: event.sequence_id};
      }
      case EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_INHERITANCE_COMPLETED: {
        aggregate.running_apply_payment_term_inheritance.push({
          job_id: event.id
        });
        return {...aggregate, last_sequence_id: event.sequence_id};
      }
      default:
        throw new Error(`Event type not supported: ${type}`);
    }
  }
}
