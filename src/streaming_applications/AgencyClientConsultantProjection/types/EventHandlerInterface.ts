import {EventInterface} from './EventInterface';
import {
  AddAgencyClientConsultantCommandDataInterface,
  RemoveAgencyClientConsultantCommandDataInterface
} from '../../../AgencyClient/types/CommandDataTypes';
import {UpdateAgencyConsultantRoleCommandDataInterface} from '../../../Agency/types/CommandDataTypes';

export type EventDataType =
  | AddAgencyClientConsultantCommandDataInterface
  | RemoveAgencyClientConsultantCommandDataInterface
  | UpdateAgencyConsultantRoleCommandDataInterface;

export interface EventHandlerInterface {
  handle(event: EventInterface<EventDataType>): Promise<void>;
}
