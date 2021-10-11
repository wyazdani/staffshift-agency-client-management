import {map} from 'lodash';
import {WriteProjectionInterface} from '../WriteProjectionInterface';
import {AgencyAggregateRecordInterface, AgencyConsultantRoleEnum, AgencyConsultantRoleInterface} from './types';
import {
  AddAgencyConsultantRoleCommandDataInterface,
  DisableAgencyConsultantRoleCommandDataInterface,
  UpdateAgencyConsultantRoleCommandDataInterface
} from './types/CommandDataTypes';
import {EventStoreModelInterface} from '../models/EventStore';
import {EventsEnum} from '../Events';

/**
 * TODO
 */
export class AgencyWriteProjectionHandler implements WriteProjectionInterface<AgencyAggregateRecordInterface> {
  execute(
    type: EventsEnum,
    aggregate: AgencyAggregateRecordInterface,
    event: EventStoreModelInterface
  ): AgencyAggregateRecordInterface {
    switch (type) {
      case EventsEnum.AGENCY_CONSULTANT_ROLE_ADDED: {
        const eventData = event.data as AddAgencyConsultantRoleCommandDataInterface;
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
        const eventData = event.data as UpdateAgencyConsultantRoleCommandDataInterface;

        aggregate.consultant_roles = map(aggregate.consultant_roles, (item) => {
          if (item._id === eventData._id) {
            return {...item, ...event.data};
          }

          return item;
        });

        return {...aggregate, last_sequence_id: event.sequence_id};
      }
      case EventsEnum.AGENCY_CONSULTANT_ROLE_DISABLED: {
        const eventData = event.data as DisableAgencyConsultantRoleCommandDataInterface;

        aggregate.consultant_roles = map(aggregate.consultant_roles, (item) => {
          if (item._id == eventData._id) {
            return {...item, status: AgencyConsultantRoleEnum.AGENCY_CONSULTANT_ROLE_STATUS_DISABLED};
          }

          return item;
        });

        return {...aggregate, last_sequence_id: event.sequence_id};
      }
      default:
        throw new Error('Not found');
    }
  }
}
