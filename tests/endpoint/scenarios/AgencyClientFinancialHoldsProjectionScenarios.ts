import {AgencyClientFinancialHoldsProjection} from '../../../src/models/AgencyClientFinancialHoldsProjectionV1';
import {assign} from 'lodash';

export class AgencyClientFinancialHoldsProjectionScenarios {
  static async create(opts?: any): Promise<void> {
    await AgencyClientFinancialHoldsProjection.create(
      assign(
        {
          agency_id: '62dfe8dcf9fe8decf9000001',
          client_id: '62dfe8e3fa8604b62d000001',
          inherited: true,
          financial_hold: 'applied',
          note: 'sample',
          _etags: {
            financial_hold: 101,
            organisation_job: 101
          }
        },
        opts
      )
    );
  }

  static async removeAll(): Promise<void> {
    await AgencyClientFinancialHoldsProjection.deleteMany({});
  }
}
