import {AgencyConsultantRolesProjectionV2} from '../../../src/models/AgencyConsultantRolesProjectionV2';
import {assign} from 'lodash';

export class AgencyConsultantRolesProjectionScenarios {
  /**
   * create the record
   *
   * @param opts - overrides the record properties
   */
  static async create(opts?: any): Promise<void> {
    await AgencyConsultantRolesProjectionV2.create(
      assign(
        {
          agency_id: '6156bd47e687e16b58000001',
          name: 'name',
          description: 'desc',
          max_consultants: 2,
          status: 'enabled'
        },
        opts
      )
    );
  }

  /**
   * remove all records
   */
  static async removeAll(): Promise<void> {
    await AgencyConsultantRolesProjectionV2.deleteMany({});
  }
}
