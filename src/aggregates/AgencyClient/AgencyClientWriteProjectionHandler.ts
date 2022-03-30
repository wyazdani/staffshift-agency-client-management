import {differenceWith} from 'lodash';
import {AgencyClientAggregateRecordInterface, AgencyClientConsultantInterface} from './types';
import {WriteProjectionInterface} from 'WriteProjectionInterface';
import {EventsEnum} from '../../Events';
import {EventStoreModelInterface} from '../../models/EventStore';
import {
  AgencyClientConsultantAssignedEventStoreDataInterface,
  AgencyClientConsultantUnassignedEventStoreDataInterface,
  AgencyClientLinkedEventStoreDataInterface,
  AgencyClientSyncedEventStoreDataInterface
} from 'EventStoreDataTypes';

/**
 * Responsible for handling all agency client events to build the current state of the aggregate
 */
export class AgencyClientWriteProjectionHandler
implements WriteProjectionInterface<AgencyClientAggregateRecordInterface> {
  execute(
    type: EventsEnum,
    aggregate: AgencyClientAggregateRecordInterface,
    event: EventStoreModelInterface
  ): AgencyClientAggregateRecordInterface {
    switch (type) {
      case EventsEnum.AGENCY_CLIENT_LINKED: {
        aggregate.linked = true;
        aggregate.client_type = (event.data as AgencyClientLinkedEventStoreDataInterface).client_type;

        return {...aggregate, last_sequence_id: event.sequence_id};
      }
      case EventsEnum.AGENCY_CLIENT_UNLINKED: {
        aggregate.linked = false;

        return {...aggregate, last_sequence_id: event.sequence_id};
      }
      case EventsEnum.AGENCY_CLIENT_SYNCED: {
        const eventData = event.data as AgencyClientSyncedEventStoreDataInterface;

        aggregate.linked = eventData.linked;
        aggregate.client_type = eventData.client_type;

        return {...aggregate, last_sequence_id: event.sequence_id};
      }
      case EventsEnum.AGENCY_CLIENT_CONSULTANT_ASSIGNED: {
        const eventData = event.data as AgencyClientConsultantAssignedEventStoreDataInterface;
        const consultant: AgencyClientConsultantInterface = {
          _id: eventData._id,
          consultant_role_id: eventData.consultant_role_id,
          consultant_id: eventData.consultant_id
        };

        aggregate.consultants ? aggregate.consultants.push(consultant) : (aggregate.consultants = [consultant]);

        return {...aggregate, last_sequence_id: event.sequence_id};
      }
      case EventsEnum.AGENCY_CLIENT_CONSULTANT_UNASSIGNED: {
        const eventData = event.data as AgencyClientConsultantUnassignedEventStoreDataInterface;

        aggregate.consultants = differenceWith(
          aggregate.consultants,
          [eventData],
          (value, other) => value._id == other._id
        );

        return {...aggregate, last_sequence_id: event.sequence_id};
      }
      default:
        throw new Error(`Event type not supported: ${type}`);
    }
  }
}
