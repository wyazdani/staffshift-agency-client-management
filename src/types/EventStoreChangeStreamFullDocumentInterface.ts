import {EventStoreDocumentType} from '../models/EventStore';

export interface EventStoreChangeStreamFullDocumentInterface<EventDataType, AggregateId> {
  _id: string; // change stream identifier
  event: EventStoreDocumentType<EventDataType, AggregateId>; // full document from event store collection
}
