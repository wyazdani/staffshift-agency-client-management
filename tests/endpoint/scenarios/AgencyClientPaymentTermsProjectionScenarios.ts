import {AgencyClientPaymentTermsProjection} from '../../../src/models/AgencyClientPaymentTermsProjectionV1';
import {assign} from 'lodash';

export class AgencyClientPaymentTermsProjectionScenarios {
  static async create(opts?: any): Promise<void> {
    await AgencyClientPaymentTermsProjection.create(
      assign(
        {
          agency_id: '62dfe8dcf9fe8decf9000001',
          client_id: '62dfe8e3fa8604b62d000001',
          inherited: true,
          payment_term: 'credit'
        },
        opts
      )
    );
  }

  static async removeAll(): Promise<void> {
    await AgencyClientPaymentTermsProjection.deleteMany({});
  }
}
