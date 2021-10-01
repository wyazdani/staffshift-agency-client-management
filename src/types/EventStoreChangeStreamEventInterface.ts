import {EventInterface} from '../streaming_applications/AgencyClientConsultantProjection/types/EventInterface';
import {EventDataType} from '../streaming_applications/AgencyClientConsultantProjection/types/EventHandlerInterface';

export interface EventStoreChangeStreamEventInterface {
  _id: string;
  event: EventInterface<EventDataType>;
}
