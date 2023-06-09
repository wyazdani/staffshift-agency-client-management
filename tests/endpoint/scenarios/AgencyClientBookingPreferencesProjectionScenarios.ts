import {get} from 'lodash';
import {
  AgencyClientBookingPreferencesProjection,
  AgencyClientBookingPreferencesProjectionV1DocumentType
} from '../../../src/models/AgencyClientBookingPreferencesProjectionV1';

export class AgencyClientBookingPreferencesProjectionScenarios {
  static async create(document: {
    [key in string]: any;
  }): Promise<AgencyClientBookingPreferencesProjectionV1DocumentType> {
    return await AgencyClientBookingPreferencesProjection.create({
      agency_id: get(document, 'agency_id', '6141d5be5863dc2202000001'),
      client_id: get(document, 'client_id', '6141d64365e0e52381000001'),
      _etags: {booking_preference: 101}
    });
  }

  static async createWithOptionals(document: {
    [key in string]: any;
  }): Promise<AgencyClientBookingPreferencesProjectionV1DocumentType> {
    return await AgencyClientBookingPreferencesProjection.create({
      agency_id: get(document, 'agency_id', '6141d5be5863dc2202000001'),
      client_id: get(document, 'client_id', '6141d64365e0e52381000001'),
      requires_po_number: get(document, 'requires_po_number', false),
      requires_unique_po_number: get(document, 'requires_unique_po_number', false),
      requires_booking_password: get(document, 'requires_booking_password', false),
      booking_passwords: get(document, 'booking_passwords', ['oops']),
      requires_shift_ref_number: get(document, 'requires_shift_ref_number', false),
      _etags: {booking_preference: 101}
    });
  }

  static async removeAll(): Promise<void> {
    await AgencyClientBookingPreferencesProjection.deleteMany({}).exec();
  }
}
