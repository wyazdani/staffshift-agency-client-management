import {Document, Schema, model} from 'mongoose';
import {AgencyClientConsultantInterface} from '../AgencyClient/types';

export type AgencyClientEventLogDocumentType = Document & {
  agency_id: string;
  client_id: string;
  event_type: string;
  snapshot: AgencyClientConsultantInterface[];
  evented_at: Date;
  created_at: Date;
  updated_at: Date;
};

const agencyClientEventLog = new Schema<AgencyClientEventLogDocumentType>(
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
export const AgencyClientEventLog = model<AgencyClientEventLogDocumentType>(
  'AgencyClientEventLog',
  agencyClientEventLog
);
