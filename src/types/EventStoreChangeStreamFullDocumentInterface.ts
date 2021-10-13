import {EventStoreModelInterface} from '../models/EventStore';

export interface EventStoreChangeStreamFullDocumentInterface {
  _id: string; // change stream identifier
  event: EventStoreModelInterface; // full document from event store collection
}
