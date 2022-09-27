import {Document, Schema, model} from 'mongoose';

export enum FINANCIAL_HOLD_PROJECTION_ENUM {
  APPLIED = 'applied',
  CLEARED = 'cleared',
  NOT_SET = 'not_set'
}

export type AgencyClientFinancialHoldsProjectionV1DocumentType = Document & {
  agency_id: string;
  client_id: string;
  financial_hold: FINANCIAL_HOLD_PROJECTION_ENUM;
  inherited: boolean;
  note?: string;
  created_at: Date;
  updated_at: Date;
  _etags: {
    financial_hold: number;
    organisation_job: number;
  };
};

const financialHolds = new Schema<AgencyClientFinancialHoldsProjectionV1DocumentType>(
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
    financial_hold: {
      type: String,
      required: true,
      description: 'Financial Hold status',
      enum: FINANCIAL_HOLD_PROJECTION_ENUM
    },
    note: {
      type: String,
      required: false,
      description: 'Note for the financial hold status'
    },
    inherited: {
      type: Boolean,
      required: true,
      description: 'Shows if the financial hold is inherited or not'
    },
    _etags: {
      financial_hold: {
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
    collection: 'AgencyClientFinancialHoldsProjectionV1'
  }
);

export const AgencyClientFinancialHoldsProjection = model<AgencyClientFinancialHoldsProjectionV1DocumentType>(
  'AgencyClientFinancialHoldsProjectionV1',
  financialHolds
);
