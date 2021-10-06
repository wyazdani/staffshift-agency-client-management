import {Document, Schema, model} from 'mongoose';

export type AgencyClientConsultantDocumentType = Document & {
  agency_id: string;
  client_id: string;
  consultant_role_id: string;
  consultant_role_name: string;
  consultant_id: string;
  created_at: Date;
  updated_at: Date;
};

const agencyClientConsultantsSchema = new Schema<AgencyClientConsultantDocumentType>(
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
    consultant_role_id: {
      type: String,
      required: true,
      description: 'The consultant role id'
    },
    consultant_role_name: {
      type: String,
      required: true,
      description: 'The consultant role name'
    },
    consultant_id: {
      type: String,
      required: true,
      description: 'The consultant id, a reference to the staffshift user_id'
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    collection: 'AgencyClientConsultantsProjection'
  }
);

const toJSONConfig = {
  transform: (doc: AgencyClientConsultantDocumentType, ret: AgencyClientConsultantDocumentType) => {
    ret._id = ret._id.toString();
  }
};

agencyClientConsultantsSchema.set('toJSON', toJSONConfig);

/**
 * Defines the model for the AgencyClientConsultants Read Projection
 */
export const AgencyClientConsultantsProjection = model<AgencyClientConsultantDocumentType>(
  'AgencyClientConsultantsProjection',
  agencyClientConsultantsSchema
);
