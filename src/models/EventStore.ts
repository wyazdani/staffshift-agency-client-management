import {Document, Schema, model} from 'mongoose';
export type EventStoreDocument = Document & {
  type: string,
  aggregate_id: Object,
  data: Object,
  sequence_id: number,
  created_at: Date,
  updated_at: Date
};

const eventStoreSchema = new Schema<EventStoreDocument>(
  {
    type: {
      type: String,
      required: true,
      description: 'The event type aka the event name'
    },
    aggregate_id: {
      type: Object,
      required: true
    },
    data: {
      type: Object,
      required: true,
      description: 'Free-form defined by the actual type'
    },
    sequence_id: {
      type: Number,
      required: true,
      description: 'An artificial sequencer to reduce aggregate level concurrency'
    }
  },
  {
    versionKey: false,
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    collection: 'EventStore'
  }
);

/**
 * Defines the model for the Event Store
 */
export const EventStore = model<EventStoreDocument>('EventStore', eventStoreSchema);
