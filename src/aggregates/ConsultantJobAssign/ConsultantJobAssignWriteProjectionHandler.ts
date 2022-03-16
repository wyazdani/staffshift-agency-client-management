import {WriteProjectionInterface} from 'WriteProjectionInterface';
import {EventsEnum} from '../../Events';
import {EventStoreModelInterface} from '../../models/EventStore';
import {ConsultantJobAssignAggregateRecordInterface} from './types';

/**
 * Responsible for handling all events to build the current state of the aggregate
 */
export class ConsultantJobAssignWriteProjectionHandler
implements WriteProjectionInterface<ConsultantJobAssignAggregateRecordInterface> {
  execute(
    type: EventsEnum,
    aggregate: ConsultantJobAssignAggregateRecordInterface,
    event: EventStoreModelInterface
  ): ConsultantJobAssignAggregateRecordInterface {
    switch (type) {
      case EventsEnum.CONSULTANT_JOB_ASSIGN_PROCESS_STARTED:
        return {...aggregate, last_sequence_id: event.sequence_id};
      case EventsEnum.CONSULTANT_JOB_ASSIGN_PROCESS_ITEM_SUCCEEDED:
        return {...aggregate, last_sequence_id: event.sequence_id};
      case EventsEnum.CONSULTANT_JOB_ASSIGN_PROCESS_ITEM_FAILED:
        return {...aggregate, last_sequence_id: event.sequence_id};
      case EventsEnum.CONSULTANT_JOB_ASSIGN_PROCESS_COMPLETED:
        return {...aggregate, last_sequence_id: event.sequence_id};
      default:
        throw new Error(`Event type not supported: ${type}`);
    }
  }
}
