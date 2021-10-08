import {Document, Schema, model} from 'mongoose';
import {EventsEnum} from '../Events';
import {AgencyCommandDataType} from '../Agency/types/AgencyCommandDataType';
import {AgencyClientCommandDataType} from '../AgencyClient/types/AgencyClientCommandDataType';
import {BaseAggregateIdInterface} from 'BaseAggregateIdInterface';

const contextSchema = new Schema<Document>(
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

const eventMetaDataSchema = new Schema(
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

export type EventStoreDocumentType<T, P> = Document & {
  type: EventsEnum;
  aggregate_id: T;
  data: P;
  sequence_id: number;
  meta_data: typeof eventMetaDataSchema;
  correlation_id: string;
  created_at: Date;
  updated_at: Date;
};

const eventStoreSchema = new Schema(
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
    meta_data: {
      type: eventMetaDataSchema,
      require: true,
      description: 'Meta data that describes the event but does not belong to the event'
    },
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
export const EventStore = model<
  EventStoreDocumentType<BaseAggregateIdInterface, AgencyCommandDataType | AgencyClientCommandDataType>
>('EventStore', eventStoreSchema);
