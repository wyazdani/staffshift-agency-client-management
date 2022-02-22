import {ConsultantAggregateRecordInterface} from './types';
import {WriteProjectionInterface} from '../WriteProjectionInterface';
import {EventsEnum} from '../Events';
import {EventStoreModelInterface} from '../models/EventStore';

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
      // case EventsEnum.AGENCY_CLIENT_LINKED: {
      //   aggregate.linked = true;
      //   aggregate.client_type = (event.data as AgencyClientLinkedEventStoreDataInterface).client_type;
      //
      //   return {...aggregate, last_sequence_id: event.sequence_id};
      // }
      default:
        throw new Error(`Event type not supported: ${type}`);
    }
  }
}
