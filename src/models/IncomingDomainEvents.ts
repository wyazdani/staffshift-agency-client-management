import {Document, Schema, model} from 'mongoose';
import {GenericObjectInterface} from 'GenericObjectInterface';

export type IncomingDomainEventDocumentType = Document & {
  type: string,
  aggregate_id: GenericObjectInterface,
  data: GenericObjectInterface,
  sequence_id: number,
  created_at: Date,
  updated_at: Date
};

const incomingDomainEventsSchema = new Schema<IncomingDomainEventDocumentType>(
  {
    event: {
      type: Object,
      required: true
    },
    event_data: {
      type: Object,
      required: true
    },
    application_jwt: {
      type: String,
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    collection: 'IncomingDomainEvents',
    _id: false
  }
);

/**
 * Defines the model for the IncomingDomainEvents, stored merely for debugging historical scenarios
 * We are never going to use this collection to populate / process within this service
 */
export const IncomingDomainEvents =
  model<IncomingDomainEventDocumentType>('IncomingDomainEvents', incomingDomainEventsSchema);
