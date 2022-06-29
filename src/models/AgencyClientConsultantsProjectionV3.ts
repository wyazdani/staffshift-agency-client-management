import {Document, Schema, model} from 'mongoose';

export type AgencyClientConsultantV3DocumentType = Document & {
  agency_id: string;
  client_id: string;
  consultant_role_id: string;
  consultant_role_name: string;
  consultant_id: string;
  created_at: Date;
  updated_at: Date;
  consultant_name: string;
};

const agencyClientConsultantsSchema = new Schema<AgencyClientConsultantV3DocumentType>(
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
    },
    consultant_name: {
      type: String,
      required: true,
      description: 'The consultant name enriched from facade'
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    collection: 'AgencyClientConsultantsProjectionV3'
  }
);

const toJSONConfig = {
  transform: (doc: AgencyClientConsultantV3DocumentType, ret: AgencyClientConsultantV3DocumentType) => {
    ret._id = ret._id.toString();
  }
};

agencyClientConsultantsSchema.set('toJSON', toJSONConfig);

/**
 * Defines the model for the AgencyClientConsultants Read Projection
 */
export const AgencyClientConsultantsProjectionV3 = model<AgencyClientConsultantV3DocumentType>(
  'AgencyClientConsultantsProjectionV3',
  agencyClientConsultantsSchema
);
