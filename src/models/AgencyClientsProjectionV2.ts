import {Document, Schema, model} from 'mongoose';

export type AgencyClientsProjectionV2DocumentType = Document & {
  agency_id: string;
  client_id: string;
  organisation_id: string;
  site_id: string;
  client_type: string;
  linked: boolean;
  created_at: Date;
  updated_at: Date;
};

const agencyClients = new Schema<AgencyClientsProjectionV2DocumentType>(
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
  {
    versionKey: false,
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    collection: 'AgencyClientsProjectionV2'
  }
);

/**
 * Defines the model for the AgencyClients Read Projection
 */
export const AgencyClientsProjectionV2 = model<AgencyClientsProjectionV2DocumentType>(
  'AgencyClientsProjectionV2',
  agencyClients
);
