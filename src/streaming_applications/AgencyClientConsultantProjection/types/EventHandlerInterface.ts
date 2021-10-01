import {
  AgencyClientConsultantAssignedEventDataInterface,
  AgencyClientConsultantUnassignedEventDataInterface,
  AgencyConsultantRoleDetailsUpdatedEventDataInterface
} from './EventDataTypes';
import {EventInterface} from './EventInterface';

export type EventDataType =
  | AgencyClientConsultantAssignedEventDataInterface
  | AgencyClientConsultantUnassignedEventDataInterface
  | AgencyConsultantRoleDetailsUpdatedEventDataInterface;

export interface EventHandlerInterface {
  handle(event: EventInterface<EventDataType>): Promise<void>;
}
