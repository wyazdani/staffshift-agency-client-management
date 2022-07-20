import {
  AgencyClientInheritanceProcessItemSucceededEventStoreDataInterface,
  AgencyClientInheritanceProcessItemFailedEventStoreDataInterface
} from 'EventTypes';
import {has} from 'lodash';
import {WriteProjectionInterface} from 'WriteProjectionInterface';
import {EventsEnum} from '../../Events';
import {EventStoreModelInterface} from '../../models/EventStore';
import {ClientInheritanceProcessAggregateRecordInterface} from './types';
import {ClientInheritanceProcessAggregateStatusEnum} from './types/ClientInheritanceProcessAggregateStatusEnum';

/**
 * Responsible for handling all events to build the current state of the aggregate
 */
export class ClientInheritanceProcessWriteProjectionHandler
implements WriteProjectionInterface<ClientInheritanceProcessAggregateRecordInterface> {
  execute(
    type: EventsEnum,
    aggregate: ClientInheritanceProcessAggregateRecordInterface,
    event: EventStoreModelInterface
  ): ClientInheritanceProcessAggregateRecordInterface {
    if (!has(aggregate, 'progressed_items')) {
      aggregate.progressed_items = [];
    }
    if (!has(aggregate, 'status')) {
      aggregate.status = ClientInheritanceProcessAggregateStatusEnum.NEW;
    }
    switch (type) {
      case EventsEnum.AGENCY_CLIENT_INHERITANCE_PROCESS_STARTED:
        aggregate.status = ClientInheritanceProcessAggregateStatusEnum.STARTED;
        return {...aggregate, last_sequence_id: event.sequence_id};
      case EventsEnum.AGENCY_CLIENT_INHERITANCE_PROCESS_ITEM_SUCCEEDED:
        aggregate.progressed_items.push(
          event.data as AgencyClientInheritanceProcessItemSucceededEventStoreDataInterface
        );
        return {...aggregate, last_sequence_id: event.sequence_id};
      case EventsEnum.AGENCY_CLIENT_INHERITANCE_PROCESS_ITEM_FAILED:
        aggregate.progressed_items.push(event.data as AgencyClientInheritanceProcessItemFailedEventStoreDataInterface);
        return {...aggregate, last_sequence_id: event.sequence_id};
      case EventsEnum.AGENCY_CLIENT_INHERITANCE_PROCESS_COMPLETED:
        aggregate.status = ClientInheritanceProcessAggregateStatusEnum.COMPLETED;
        return {...aggregate, last_sequence_id: event.sequence_id};
      default:
        throw new Error(`Event type not supported: ${type}`);
    }
  }
}
