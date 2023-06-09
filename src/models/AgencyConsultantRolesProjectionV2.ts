import {Document, Schema, model} from 'mongoose';

export type AgencyConsultantRolesProjectionV2DocumentType = Document & {
  _id: string;
  agency_id: string;
  name: string;
  description: string;
  max_consultants: number;
  status: string;
};

const agencyConsultantRoles = new Schema<AgencyConsultantRolesProjectionV2DocumentType>(
  {
    agency_id: {
      type: String,
      required: true,
      description: 'The agency id',
      http_hidden: true
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
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    collection: 'AgencyConsultantRolesProjectionV2'
  }
);

/**
 * Defines the model for the AgencyConsultant roles Read Projection
 */
export const AgencyConsultantRolesProjectionV2 = model<AgencyConsultantRolesProjectionV2DocumentType>(
  'AgencyConsultantRolesProjectionV2',
  agencyConsultantRoles
);
