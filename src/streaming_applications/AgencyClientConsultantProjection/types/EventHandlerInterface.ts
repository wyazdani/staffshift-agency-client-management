import {
  AddAgencyClientConsultantCommandDataInterface,
  RemoveAgencyClientConsultantCommandDataInterface
} from '../../../AgencyClient/types/CommandDataTypes';
import {UpdateAgencyConsultantRoleCommandDataInterface} from '../../../Agency/types/CommandDataTypes';
import {EventStoreDocumentType} from '../../../models/EventStore';

export type EventDataType =
  | AddAgencyClientConsultantCommandDataInterface
  | RemoveAgencyClientConsultantCommandDataInterface
  | UpdateAgencyConsultantRoleCommandDataInterface;

export interface EventHandlerInterface<T, P> {
  handle(event: EventStoreDocumentType<T, P>): Promise<void>;
}
