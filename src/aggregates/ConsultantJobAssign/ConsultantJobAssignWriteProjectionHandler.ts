import {ConsultantJobAssignAggregateRecordInterface} from './types';
import {WriteProjectionInterface} from '../../WriteProjectionInterface';
import {EventsEnum} from '../../Events';
import {EventStoreModelInterface} from '../../models/EventStore';

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
      // Implement projection here
      default:
        throw new Error(`Event type not supported: ${type}`);
    }
  }
}
