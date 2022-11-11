import {Document, Schema, model} from 'mongoose';

export enum PAYMENT_TERM_PROJECTION_ENUM {
  CREDIT = 'credit',
  PAY_IN_ADVANCE = 'pay_in_advance',
  NOT_SET = 'not_set'
}

export type AgencyClientPaymentTermsProjectionV1DocumentType = Document & {
  agency_id: string;
  client_id: string;
  payment_term: PAYMENT_TERM_PROJECTION_ENUM;
  inherited: boolean;
  created_at: Date;
  updated_at: Date;
  _etags: {
    payment_term: number;
    organisation_job: number;
  };
};

const agencyClients = new Schema<AgencyClientPaymentTermsProjectionV1DocumentType>(
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
    payment_term: {
      type: String,
      required: true,
      description: 'Payment term',
      enum: PAYMENT_TERM_PROJECTION_ENUM
    },
    inherited: {
      type: Boolean,
      required: true,
      description: 'Shows if the payment term is inherited or not'
    },
    _etags: {
      payment_term: {
        type: Number,
        required: true,
        description: 'Last aggregate sequence identifier processed'
      },
      organisation_job: {
        type: Number,
        required: true,
        description: 'Sequence identifier of the last organistation job update processed'
      }
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    collection: 'AgencyClientPaymentTermsProjectionV1'
  }
);

export const AgencyClientPaymentTermsProjection = model<AgencyClientPaymentTermsProjectionV1DocumentType>(
  'AgencyClientPaymentTermsProjectionV1',
  agencyClients
);
