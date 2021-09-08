import {Document, Schema, model} from 'mongoose';
export type AgencyClientEventLogDocument = Document & {
  agency_id: string,
  client_id: string,
  event_type: string,
  snapshot: Object,
  evented_at: Date,
  created_at: Date,
  updated_at: Date
};
const agencyClientEventLog = new Schema<AgencyClientEventLogDocument>(
  {
    agency_id: {
      type: String,
      required: true,
      description: 'The agency id'
    },
    client_id: {
      type: String,
      required: true,
      description: 'The client id'
    },
    event_type: {
      type: String,
      required: true,
      description: 'The event type / name'
    },
    snapshot: {
      type: Object,
      required: true,
      description: 'The snapshot of the datapoint up to the event sequence_id'
    },
    evented_at: {
      type: Date,
      required: true,
      description: 'Indicates the time the event took place, not related to this collection'
    }
  },
  // What does created_at AND updated_at represent?
  // This is a projection, does it indicate when the entries where added / updated on the projection?
  {
    // We will most likely need to keep the version key to apply optimistic locks
    versionKey: false,
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    collection: 'AgencyClientEventLog'
  }
);

/**
 * Defines the model for the AgencyClientEventLog Read Projection
 */
export const AgencyClientEventLog = model<AgencyClientEventLogDocument>('AgencyClientEventLog', agencyClientEventLog);
