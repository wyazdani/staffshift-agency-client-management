import _ from 'lodash';
import {AgencyConsultantRoleEnums, AgencyEventEnums} from './Enums';
import {AgencyAggregateRecord, AgencyConsultantRole} from "./Interfaces";


export const AgencyWriteProjection = {
  [AgencyEventEnums.AGENCY_CONSULTANT_ROLE_ADDED]: (aggregate: AgencyAggregateRecord, event: any): AgencyAggregateRecord => {
    const consultantRole: AgencyConsultantRole = {
      _id: event.data._id,
      name: event.data.name,
      description: event.data.description,
      max_consultants: event.data.max_consultants
    };
    (aggregate.consultant_roles) ?
      aggregate.consultant_roles.push(consultantRole) :
      aggregate.consultant_roles = [consultantRole];
    return {...aggregate, last_sequence_id: event.sequence_id};
  },
  [AgencyEventEnums.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED]: (aggregate: AgencyAggregateRecord, event: any): AgencyAggregateRecord => {
    aggregate.consultant_roles = _.map(aggregate.consultant_roles, (item) => {
      if (item._id == event.data._id) {
        return {...item, ...event.data};
      }
      return item;
    });
    return {...aggregate, last_sequence_id: event.sequence_id};
  },
  [AgencyEventEnums.AGENCY_CONSULTANT_ROLE_ENABLED]: (aggregate: AgencyAggregateRecord, event: any): AgencyAggregateRecord => {
    aggregate.consultant_roles = _.map(aggregate.consultant_roles, (item) => {
      if (item._id == event.data._id) {
        return {...item, status: AgencyConsultantRoleEnums.AGENCY_CONSULTANT_ROLE_STATUS_ENABLED};
      }
      return item;
    });
    return {...aggregate, last_sequence_id: event.sequence_id};
  },
  [AgencyEventEnums.AGENCY_CONSULTANT_ROLE_DISABLED]: (aggregate: AgencyAggregateRecord, event: any): AgencyAggregateRecord => {
    aggregate.consultant_roles = _.map(aggregate.consultant_roles, (item) => {
      if (item._id == event.data._id) {
        return {...item, status: AgencyConsultantRoleEnums.AGENCY_CONSULTANT_ROLE_STATUS_DISABLED};
      }
      return item;
    });
    return {...aggregate, last_sequence_id: event.sequence_id};
  }
};
