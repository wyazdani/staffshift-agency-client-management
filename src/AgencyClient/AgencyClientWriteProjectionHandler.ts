import {differenceWith} from 'lodash';
import {
  AgencyClientAggregateIdInterface,
  AgencyClientAggregateRecordInterface,
  AgencyClientConsultantInterface
} from './types';
import {
  AddAgencyClientConsultantCommandDataInterface,
  LinkAgencyClientCommandDataInterface,
  RemoveAgencyClientConsultantCommandDataInterface,
  SyncAgencyClientCommandDataInterface
} from './types/CommandDataTypes';
import {AgencyClientCommandDataType} from './types/AgencyClientCommandDataType';
import {WriteProjectionInterface} from '../WriteProjectionInterface';
import {EventsEnum} from '../Events';
import {EventStoreDocumentType} from '../models/EventStore';

/**
 * TODO
 */
export class AgencyClientWriteProjectionHandler implements WriteProjectionInterface<AgencyClientCommandDataType> {
  execute(
    type: EventsEnum,
    aggregate: AgencyClientAggregateRecordInterface,
    event: EventStoreDocumentType<AgencyClientAggregateIdInterface, AgencyClientCommandDataType>
  ): AgencyClientAggregateRecordInterface {
    switch (type) {
      case EventsEnum.AGENCY_CLIENT_LINKED:
        aggregate.linked = true;
        aggregate.client_type = (event.data as LinkAgencyClientCommandDataInterface).client_type;

        return {...aggregate, last_sequence_id: event.sequence_id};
      case EventsEnum.AGENCY_CLIENT_UNLINKED:
        aggregate.linked = false;

        return {...aggregate, last_sequence_id: event.sequence_id};
      case EventsEnum.AGENCY_CLIENT_SYNCED: {
        const eventData = event.data as SyncAgencyClientCommandDataInterface;

        aggregate.linked = eventData.linked;
        aggregate.client_type = eventData.client_type;

        return {...aggregate, last_sequence_id: event.sequence_id};
      }
      case EventsEnum.AGENCY_CLIENT_CONSULTANT_ASSIGNED: {
        const eventData = event.data as AddAgencyClientConsultantCommandDataInterface;
        const consultant: AgencyClientConsultantInterface = {
          _id: eventData._id,
          consultant_role_id: eventData.consultant_role_id,
          consultant_id: eventData.consultant_id
        };

        aggregate.consultants ? aggregate.consultants.push(consultant) : (aggregate.consultants = [consultant]);

        return {...aggregate, last_sequence_id: event.sequence_id};
      }
      case EventsEnum.AGENCY_CLIENT_CONSULTANT_UNASSIGNED: {
        const eventData = event.data as RemoveAgencyClientConsultantCommandDataInterface;

        aggregate.consultants = differenceWith(
          aggregate.consultants,
          [eventData],
          (value, other) => value._id == other._id
        );

        return {...aggregate, last_sequence_id: event.sequence_id};
      }
      default:
        throw new Error('Event type not supported');
    }
  }
}
