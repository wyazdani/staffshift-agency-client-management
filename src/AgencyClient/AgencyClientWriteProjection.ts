import _ from 'lodash';
import {AgencyClientEventType} from './AgencyClientEnums';
import {AgencyClientAggregateRecord, AgencyClientConsultant} from './Interfaces';

export const AgencyClientWriteProjection = {
  [AgencyClientEventType.AGENCY_CLIENT_LINKED]: (aggregate: AgencyClientAggregateRecord, event: any): AgencyClientAggregateRecord => {
    aggregate.linked = true;
    aggregate.client_type = event.data.client_type;
    return {...aggregate, last_sequence_id: event.sequence_id};
  },
  [AgencyClientEventType.AGENCY_CLIENT_UNLINKED]: (aggregate: AgencyClientAggregateRecord, event: any): AgencyClientAggregateRecord => {
    aggregate.linked = false;
    return {...aggregate, last_sequence_id: event.sequence_id};
  },
  [AgencyClientEventType.AGENCY_CLIENT_CONSULTANT_ASSIGNED]: (aggregate: AgencyClientAggregateRecord, event: any): AgencyClientAggregateRecord => {
    const consultant: AgencyClientConsultant = {
      _id: event.data._id,
      consultant_role_id: event.data.consultant_role_id,
      consultant_id: event.data.consultant_id
    };
    (aggregate.consultants) ?
      aggregate.consultants.push(consultant) :
      aggregate.consultants = [consultant];
    return {...aggregate, last_sequence_id: event.sequence_id};
  },
  [AgencyClientEventType.AGENCY_CLIENT_CONSULTANT_UNASSIGNED]: (aggregate: AgencyClientAggregateRecord, event: any): AgencyClientAggregateRecord => {
    aggregate.consultants = _.differenceWith(aggregate.consultants, [event.data], (value, other) => {
      return ((value._id == other._id));
    });
    return {...aggregate, last_sequence_id: event.sequence_id};
  }
};
