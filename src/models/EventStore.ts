import {Document, Schema, model} from 'mongoose';
export type EventStoreDocument = Document & {
  type: string,
  aggregate_id: Object,
  data: Object,
  sequence_id: number,
  created_at: Date,
  updated_at: Date
};

const contextSchema = new Schema<EventStoreDocument>(
  {
    type: {
      type: String,
      required: true,
      description: 'The context type as per the staffshift enums https://github.com/A24Group/staffshift-node-enums'
    },
    id: {
      type: String,
      required: false,
      description: 'The context type identifier'
    }
  },
  {
    _id: false
  }
);

const eventMetaDataSchema = new Schema<EventStoreDocument>(
  {
    user_id: {
      type: String,
      required: true,
      description: 'The user id, may be an acutal user_id OR system'
    },
    client_id: {
      type: String,
      required: false,
      description: 'The oauth client id, undefined when a system related event is created'
    },
    context: {
      type: contextSchema,
      required: false,
      description: 'The context type and id, undefined when a system related event is created'
    }
  },
  {
    _id: false
  }
);

const eventStoreSchema = new Schema<EventStoreDocument>(
  {
    type: {
      type: String,
      required: true,
      description: 'The event type aka the event name'
    },
    aggregate_id: {
      type: Object,
      required: true,
      description: 'Uniquely identifies the aggregate'
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
    },
    meta_data: eventMetaDataSchema,
    correlation_id: {
      type: String,
      required: true,
      description: 'Similar to a process_id / request_id depending on the source of the command and events'
    }
  },
  {
    versionKey: false,
    timestamps: {
      createdAt: 'created_at',
      updatedAt: false
    },
    collection: 'EventStore'
  }
);

/**
 * Defines the model for the Event Store
 */
export const EventStore = model<EventStoreDocument>('EventStore', eventStoreSchema);
