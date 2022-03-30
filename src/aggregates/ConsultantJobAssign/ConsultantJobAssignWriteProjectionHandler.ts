import {
  ConsultantJobAssignProcessItemSucceededEventStoreDataInterface,
  ConsultantJobAssignProcessItemFailedEventStoreDataInterface
} from 'EventStoreDataTypes';
import {has} from 'lodash';
import {WriteProjectionInterface} from 'WriteProjectionInterface';
import {EventsEnum} from '../../Events';
import {EventStoreModelInterface} from '../../models/EventStore';
import {ConsultantJobAssignAggregateRecordInterface} from './types';
import {ConsultantJobAssignAggregateStatusEnum} from './types/ConsultantJobAssignAggregateStatusEnum';

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
    if (!has(aggregate, 'progressed_client_ids')) {
      aggregate.progressed_client_ids = [];
    }
    if (!has(aggregate, 'status')) {
      aggregate.status = ConsultantJobAssignAggregateStatusEnum.NEW;
    }
    switch (type) {
      case EventsEnum.CONSULTANT_JOB_ASSIGN_PROCESS_STARTED:
        aggregate.status = ConsultantJobAssignAggregateStatusEnum.STARTED;
        return {...aggregate, last_sequence_id: event.sequence_id};
      case EventsEnum.CONSULTANT_JOB_ASSIGN_PROCESS_ITEM_SUCCEEDED:
        aggregate.progressed_client_ids.push(
          (event.data as ConsultantJobAssignProcessItemSucceededEventStoreDataInterface).client_id
        );
        return {...aggregate, last_sequence_id: event.sequence_id};
      case EventsEnum.CONSULTANT_JOB_ASSIGN_PROCESS_ITEM_FAILED:
        aggregate.progressed_client_ids.push(
          (event.data as ConsultantJobAssignProcessItemFailedEventStoreDataInterface).client_id
        );
        return {...aggregate, last_sequence_id: event.sequence_id};
      case EventsEnum.CONSULTANT_JOB_ASSIGN_PROCESS_COMPLETED:
        aggregate.status = ConsultantJobAssignAggregateStatusEnum.COMPLETED;
        return {...aggregate, last_sequence_id: event.sequence_id};
      default:
        throw new Error(`Event type not supported: ${type}`);
    }
  }
}
