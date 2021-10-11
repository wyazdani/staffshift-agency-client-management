import {BaseEventStoreDataInterface} from 'EventStoreDataTypes';
import {
  AddAgencyClientConsultantCommandDataInterface,
  RemoveAgencyClientConsultantCommandDataInterface
} from '../../../AgencyClient/types/CommandDataTypes';
import {UpdateAgencyConsultantRoleCommandDataInterface} from '../../../Agency/types/CommandDataTypes';
import {EventStoreModelInterface} from '../../../models/EventStore';

export type EventDataType =
  | AddAgencyClientConsultantCommandDataInterface
  | RemoveAgencyClientConsultantCommandDataInterface
  | UpdateAgencyConsultantRoleCommandDataInterface;

export interface EventHandlerInterface<EventDataInterface extends BaseEventStoreDataInterface> {
  handle(event: EventStoreModelInterface<EventDataInterface>): Promise<void>;
}
