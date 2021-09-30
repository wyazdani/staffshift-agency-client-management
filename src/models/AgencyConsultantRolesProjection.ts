import {Document, Schema, model} from 'mongoose';

export type AgencyConsultantRolesProjectionDocumentType = Document & {
  _id: string;
  agency_id: string;
  name: string;
  description: string;
  max_consultants: number;
  status: string;
};

const agencyConsultantRoles = new Schema<AgencyConsultantRolesProjectionDocumentType>(
  {
    agency_id: {
      type: String,
      required: true,
      description: 'The agency id'
    },
    name: {
      type: String,
      required: true,
      description: 'The consultant role name'
    },
    description: {
      type: String,
      required: true,
      description: 'The consultant role description'
    },
    max_consultants: {
      type: Number,
      required: true,
      description: 'Maximum allowed consultants for the role'
    },
    status: {
      type: String,
      required: false,
      description: 'The consultant role status',
      enum: ['enabled', 'disabled']
    }
  },
  // What does created_at AND updated_at represent?
  // This is a projection, does it indicate when the entries where added / updated on the projection?
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    collection: 'AgencyConsultantRolesProjection'
  }
);

/**
 * Defines the model for the AgencyClients Read Projection
 */
export const AgencyConsultantRolesProjection = model<AgencyConsultantRolesProjectionDocumentType>(
  'AgencyConsultantRolesProjection',
  agencyConsultantRoles
);
