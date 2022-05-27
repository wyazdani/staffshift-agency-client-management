import {
  ConsultantJobProcessItemSucceededEventStoreDataInterface,
  ConsultantJobProcessItemFailedEventStoreDataInterface
} from 'EventTypes';
import {has} from 'lodash';
import {WriteProjectionInterface} from 'WriteProjectionInterface';
import {EventsEnum} from '../../Events';
import {EventStoreModelInterface} from '../../models/EventStore';
import {ConsultantJobProcessAggregateRecordInterface} from './types';
import {ConsultantJobProcessAggregateStatusEnum} from './types/ConsultantJobProcessAggregateStatusEnum';

/**
 * Responsible for handling all events to build the current state of the aggregate
 */
export class ConsultantJobProcessWriteProjectionHandler
implements WriteProjectionInterface<ConsultantJobProcessAggregateRecordInterface> {
  execute(
    type: EventsEnum,
    aggregate: ConsultantJobProcessAggregateRecordInterface,
    event: EventStoreModelInterface
  ): ConsultantJobProcessAggregateRecordInterface {
    if (!has(aggregate, 'progressed_items')) {
      aggregate.progressed_items = [];
    }
    if (!has(aggregate, 'status')) {
      aggregate.status = ConsultantJobProcessAggregateStatusEnum.NEW;
    }
    switch (type) {
      case EventsEnum.CONSULTANT_JOB_PROCESS_STARTED:
        aggregate.status = ConsultantJobProcessAggregateStatusEnum.STARTED;
        return {...aggregate, last_sequence_id: event.sequence_id};
      case EventsEnum.CONSULTANT_JOB_PROCESS_ITEM_SUCCEEDED:
        aggregate.progressed_items.push(event.data as ConsultantJobProcessItemSucceededEventStoreDataInterface);
        return {...aggregate, last_sequence_id: event.sequence_id};
      case EventsEnum.CONSULTANT_JOB_PROCESS_ITEM_FAILED:
        aggregate.progressed_items.push(event.data as ConsultantJobProcessItemFailedEventStoreDataInterface);
        return {...aggregate, last_sequence_id: event.sequence_id};
      case EventsEnum.CONSULTANT_JOB_PROCESS_COMPLETED:
        aggregate.status = ConsultantJobProcessAggregateStatusEnum.COMPLETED;
        return {...aggregate, last_sequence_id: event.sequence_id};
      default:
        throw new Error(`Event type not supported: ${type}`);
    }
  }
}
