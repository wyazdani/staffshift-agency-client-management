import {EventStoreDocumentType} from '../models/EventStore';

export interface EventStoreChangeStreamEventInterface {
    _id: string;
    event: EventStoreDocumentType,
}