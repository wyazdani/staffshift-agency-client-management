import {AgencyConsultantRolesProjection} from '../../../src/models/AgencyConsultantRolesProjection';
import {GenericObjectInterface} from '../../../src/types/GenericObjectInterface';
import {assign} from 'lodash';

export class AgencyConsultantRolesProjectionScenarios {
  /**
   * create the record
   *
   * @param opts - overrides the record properties
   */
  static async create(opts?: GenericObjectInterface): Promise<void> {
    await AgencyConsultantRolesProjection.create(
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
    await AgencyConsultantRolesProjection.deleteMany({});
  }
}
