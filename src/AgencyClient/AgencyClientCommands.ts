import {AgencyClientCommandEnum, AgencyClientEventEnum} from './AgencyClientEnums';
import {ObjectID} from 'mongodb';
import {AgencyClientConsultantInterface, AgencyClientEventInterface} from './Interfaces';
import {AgencyClientAggregate} from './AgencyClientAggregate';

type AgencyClientCommandsType = {
  [key in AgencyClientCommandEnum]: (aggregate: AgencyClientAggregate, command: AgencyClientConsultantInterface) =>
    Promise<AgencyClientEventInterface[]>;
};

export const AgencyClientCommands: AgencyClientCommandsType = {
  // CMD coming from a Triage Domain Event
  [AgencyClientCommandEnum.LINK_AGENCY_CLIENT]:
    async (aggregate: AgencyClientAggregate, command: AgencyClientConsultantInterface): Promise<AgencyClientEventInterface[]> => {
      const isLinked = aggregate.isLinked();
      if (!isLinked) {
        let eventId = aggregate.getLastEventId();
        return [{
          type: AgencyClientEventEnum.AGENCY_CLIENT_LINKED,
          aggregate_id: aggregate.getId(),
          data: {...command},
          sequence_id: ++eventId
        }];
      }
      // If we are already linked there is no need to create another link event
      return [];
    },
  // CMD coming from a Triage Domain Event
  [AgencyClientCommandEnum.UNLINK_AGENCY_CLIENT]:
    async (aggregate: AgencyClientAggregate, command: AgencyClientConsultantInterface): Promise<AgencyClientEventInterface[]> => {
      const isLinked = aggregate.isLinked();
      // If linked OR this is the first time we are dealing with this aggregate
      if (isLinked || aggregate.getLastEventId() == 0) {
        let eventId = aggregate.getLastEventId();
        return [{
          type: AgencyClientEventEnum.AGENCY_CLIENT_UNLINKED,
          aggregate_id: aggregate.getId(),
          data: {...command},
          sequence_id: ++eventId
        }];
      }
      // If we are not linked there is no need to create another unlink event
      return [];
    },
  // CMD coming from a Triage Domain Event
  [AgencyClientCommandEnum.SYNC_AGENCY_CLIENT]:
    async (aggregate: AgencyClientAggregate, command: AgencyClientConsultantInterface): Promise<AgencyClientEventInterface[]> => {
    // Only create the event if we are not aware of the this aggregate
      if (aggregate.getLastEventId() == 0) {
        let eventId = aggregate.getLastEventId();
        return [{
          type: AgencyClientEventEnum.AGENCY_CLIENT_SYNCED,
          aggregate_id: aggregate.getId(),
          data: {...command},
          sequence_id: ++eventId
        }];
      }
      // If we have something for this aggregate then this SYNC is no longer required
      return [];
    },
  [AgencyClientCommandEnum.ADD_AGENCY_CLIENT_CONSULTANT]:
    async (aggregate: AgencyClientAggregate, command: AgencyClientConsultantInterface): Promise<AgencyClientEventInterface[]> => {
    // Need to do a try catch here
      await aggregate.validateAddClientConsultant(command);
      let eventId = aggregate.getLastEventId();
      return [{
        type: AgencyClientEventEnum.AGENCY_CLIENT_CONSULTANT_ASSIGNED,
        aggregate_id: aggregate.getId(),
        data: {
          _id: (new ObjectID).toString(),
          consultant_role_id: command.consultant_role_id,
          consultant_id: command.consultant_id
        },
        sequence_id: ++eventId
      }];
    },
  [AgencyClientCommandEnum.REMOVE_AGENCY_CLIENT_CONSULTANT]:
    async (aggregate: AgencyClientAggregate, command: AgencyClientConsultantInterface): Promise<AgencyClientEventInterface[]> => {
    // Need to do a try catch here
      await aggregate.validateRemoveClientConsultant(command);
      let eventId = aggregate.getLastEventId();
      return [{
        type: AgencyClientEventEnum.AGENCY_CLIENT_CONSULTANT_UNASSIGNED,
        aggregate_id: aggregate.getId(),
        data: {
          _id: command._id
        },
        sequence_id: ++eventId
      }];
    }
};