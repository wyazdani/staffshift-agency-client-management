import {
  ConsultantJobAssignInitiatedEventStoreDataInterface,
  ConsultantJobAssignCompletedEventStoreDataInterface
} from 'EventStoreDataTypes';
import {find} from 'lodash';
import {ConsultantJobAggregateRecordInterface} from './types';
import {WriteProjectionInterface} from '../../WriteProjectionInterface';
import {EventsEnum} from '../../Events';
import {EventStoreModelInterface} from '../../models/EventStore';
import {ConsultantAggregateRecordProcessInterface} from './types/ConsultantJobAggregateRecordInterface';

/**
 * Responsible for handling all events to build the current state of the aggregate
 */
export class ConsultantJobWriteProjectionHandler implements WriteProjectionInterface<ConsultantJobAggregateRecordInterface> {
  execute(
    type: EventsEnum,
    aggregate: ConsultantJobAggregateRecordInterface,
    event: EventStoreModelInterface
  ): ConsultantJobAggregateRecordInterface {
    switch (type) {
      case EventsEnum.CONSULTANT_JOB_ASSIGN_INITIATED: {
        const data = event.data as ConsultantJobAssignInitiatedEventStoreDataInterface;
        const process: ConsultantAggregateRecordProcessInterface = {
          _id: data._id,
          consultants: [data.consultant_id],
          status: 'initiated'
        };

        aggregate.processes ? aggregate.processes.push(process) : (aggregate.processes = [process]);

        return {...aggregate, last_sequence_id: event.sequence_id};
      }
      case EventsEnum.CONSULTANT_JOB_ASSIGN_COMPLETED: {
        const data = event.data as ConsultantJobAssignCompletedEventStoreDataInterface;
        const process = find(aggregate.processes, {_id: data._id});

        if (process) {
          process.status = 'completed';
        }
        return {...aggregate, last_sequence_id: event.sequence_id};
      }
      default:
        throw new Error(`Event type not supported: ${type}`);
    }
  }
}
