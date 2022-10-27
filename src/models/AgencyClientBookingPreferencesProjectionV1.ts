import {Document, Schema, model} from 'mongoose';

export type AgencyClientBookingPreferencesProjectionV1DocumentType = Document & {
  agency_id: string;
  client_id: string;
  requires_po_number?: boolean;
  requires_unique_po_number?: boolean;
  requires_booking_password?: boolean;
  booking_passwords?: string[];
  requires_shift_ref_number?: boolean;
  created_at: Date;
  updated_at: Date;
  _etags: {
    booking_preference: number;
  };
};

const bookingPreferences = new Schema<AgencyClientBookingPreferencesProjectionV1DocumentType>(
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
    requires_po_number: {
      type: Boolean,
      required: false,
      description: 'Requires po number'
    },
    requires_unique_po_number: {
      type: Boolean,
      required: false,
      description: 'Requires unique po number'
    },
    requires_booking_password: {
      type: Boolean,
      required: false,
      description: 'Requires booking password'
    },
    booking_passwords: {
      type: [],
      required: false,
      description: 'booking passwords array'
    },
    requires_shift_ref_number: {
      type: Boolean,
      required: false,
      description: 'Requires shift ref number'
    },
    _etags: {
      booking_preference: {
        type: Number,
        required: true,
        description: 'Last aggregate sequence identifier processed'
      }
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    collection: 'AgencyClientBookingPreferencesProjectionV1'
  }
);

export const AgencyClientBookingPreferencesProjection = model<AgencyClientBookingPreferencesProjectionV1DocumentType>(
  'AgencyClientBookingPreferencesProjectionV1',
  bookingPreferences
);
