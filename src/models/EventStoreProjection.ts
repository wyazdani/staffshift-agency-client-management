import {Schema, model} from 'mongoose';
import {eventStoreSchema, EventStoreModelInterface} from './EventStore';
export interface EventStoreProjectionModelInterface {
  event: EventStoreModelInterface;
  published_at: Date;
  received_at: Date;
  consumed_at: Date;
  process_duration_in_ms: number;
  receive_duration_in_ms: number;
  consumer_instance: string;
  created_at: Date;
}
const eventStoreProjectionSchema = new Schema(
  {
    event: {
      type: eventStoreSchema
    },
    published_at: Date,
    received_at: Date,
    consumed_at: Date,
    process_duration_in_ms: Number,
    receive_duration_in_ms: Number,
    consumer_instance: String
  },
  {
    versionKey: false,
    timestamps: {
      createdAt: 'created_at',
      updatedAt: false
    },
    collection: 'EventStoreProjection'
  }
);

/**
 * Defines the model for the Event Store Projection
 */
export const EventStoreProjection = model<EventStoreProjectionModelInterface>(
  'EventStoreProjection',
  eventStoreProjectionSchema
);
