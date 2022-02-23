import {
  ConsultantAssignInitiatedEventStoreDataInterface,
  ConsultantAssignCompletedEventStoreDataInterface
} from 'EventStoreDataTypes';
import {find} from 'lodash';
import {ConsultantAggregateRecordInterface} from './types';
import {WriteProjectionInterface} from '../WriteProjectionInterface';
import {EventsEnum} from '../Events';
import {EventStoreModelInterface} from '../models/EventStore';
import {ConsultantAggregateRecordProcessInterface} from './types/ConsultantAggregateRecordInterface';

/**
 * Responsible for handling all events to build the current state of the aggregate
 */
export class ConsultantWriteProjectionHandler implements WriteProjectionInterface<ConsultantAggregateRecordInterface> {
  execute(
    type: EventsEnum,
    aggregate: ConsultantAggregateRecordInterface,
    event: EventStoreModelInterface
  ): ConsultantAggregateRecordInterface {
    switch (type) {
      case EventsEnum.CONSULTANT_ASSIGN_INITIATED: {
        const data = event.data as ConsultantAssignInitiatedEventStoreDataInterface;
        const process: ConsultantAggregateRecordProcessInterface = {
          _id: data._id,
          consultants: [data.consultant_id],
          status: 'initiated'
        };

        aggregate.processes ? aggregate.processes.push(process) : (aggregate.processes = [process]);

        return {...aggregate, last_sequence_id: event.sequence_id};
      }
      case EventsEnum.CONSULTANT_ASSIGN_COMPLETED: {
        const data = event.data as ConsultantAssignCompletedEventStoreDataInterface;
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
