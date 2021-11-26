import {map} from 'lodash';
import {WriteProjectionInterface} from '../WriteProjectionInterface';
import {AgencyAggregateRecordInterface, AgencyConsultantRoleEnum, AgencyConsultantRoleInterface} from './types';
import {EventStoreModelInterface} from '../models/EventStore';
import {EventsEnum} from '../Events';
import {
  AgencyConsultantRoleAddedEventStoreDataInterface,
  AgencyConsultantRoleDetailsUpdatedEventStoreDataInterface,
  AgencyConsultantRoleEnabledEventStoreDataInterface,
  AgencyConsultantRoleDisabledEventStoreDataInterface
} from 'EventStoreDataTypes';

/**
 * Responsible for handling all agency events to build the current state of the aggregate
 */
export class AgencyWriteProjectionHandler implements WriteProjectionInterface<AgencyAggregateRecordInterface> {
  execute(
    type: EventsEnum,
    aggregate: AgencyAggregateRecordInterface,
    event: EventStoreModelInterface
  ): AgencyAggregateRecordInterface {
    switch (type) {
      case EventsEnum.AGENCY_CONSULTANT_ROLE_ADDED: {
        const eventData = event.data as AgencyConsultantRoleAddedEventStoreDataInterface;
        const consultantRole: AgencyConsultantRoleInterface = {
          _id: eventData._id,
          name: eventData.name,
          description: eventData.description,
          max_consultants: eventData.max_consultants
        };

        aggregate.consultant_roles
          ? aggregate.consultant_roles.push(consultantRole)
          : (aggregate.consultant_roles = [consultantRole]);

        return {...aggregate, last_sequence_id: event.sequence_id};
      }
      case EventsEnum.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED: {
        const eventData = event.data as AgencyConsultantRoleDetailsUpdatedEventStoreDataInterface;

        aggregate.consultant_roles = map(aggregate.consultant_roles, (item) => {
          if (item._id === eventData._id) {
            return {...item, ...event.data};
          }

          return item;
        });

        return {...aggregate, last_sequence_id: event.sequence_id};
      }
      case EventsEnum.AGENCY_CONSULTANT_ROLE_ENABLED: {
        const eventData = event.data as AgencyConsultantRoleEnabledEventStoreDataInterface;

        aggregate.consultant_roles = map(aggregate.consultant_roles, (item) => {
          if (item._id === eventData._id) {
            return {...item, status: AgencyConsultantRoleEnum.AGENCY_CONSULTANT_ROLE_STATUS_ENABLED};
          }

          return item;
        });

        return {...aggregate, last_sequence_id: event.sequence_id};
      }
      case EventsEnum.AGENCY_CONSULTANT_ROLE_DISABLED: {
        const eventData = event.data as AgencyConsultantRoleDisabledEventStoreDataInterface;

        aggregate.consultant_roles = map(aggregate.consultant_roles, (item) => {
          if (item._id == eventData._id) {
            return {...item, status: AgencyConsultantRoleEnum.AGENCY_CONSULTANT_ROLE_STATUS_DISABLED};
          }

          return item;
        });

        return {...aggregate, last_sequence_id: event.sequence_id};
      }
      default:
        throw new Error(`Event not supported ${type}`);
    }
  }
}
