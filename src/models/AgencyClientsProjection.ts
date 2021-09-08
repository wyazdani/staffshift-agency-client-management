import {Document, Schema, model} from "mongoose";
export type AgencyClientsProjectionDocument = Document & {
  agency_id: string,
  client_id: string,
  organisation_id: string,
  site_id: string,
  client_type: string,
  linked: boolean,
  created_at: Date,
  updated_at: Date
};
const agencyClients = new Schema<AgencyClientsProjectionDocument>(
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
    organisation_id: {
      type: String,
      required: false,
      description: 'The organisation id'
    },
    site_id: {
      type: String,
      required: false,
      description: 'The site id'
    },
    client_type: {
      type: String,
      required: true,
      description: 'The client type details'
    },
    linked: {
      type: Boolean,
      required: true,
      description: 'Flag indicating if the client is actually linked'
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
    collection: 'AgencyClientsProjection'
  }
);

/**
 * Defines the model for the AgencyClients Read Projection
 */
export const AgencyClientsProjection = model<AgencyClientsProjectionDocument>('AgencyClientsProjection', agencyClients);
