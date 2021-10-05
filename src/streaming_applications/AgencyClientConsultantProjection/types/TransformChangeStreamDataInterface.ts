import {EventInterface} from './EventInterface';
import {EventDataType} from './EventHandlerInterface';

export interface TransformChangeStreamDataInterface {
  _id: string;
  event: EventInterface<EventDataType>;
}
