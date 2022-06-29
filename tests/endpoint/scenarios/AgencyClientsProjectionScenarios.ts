import {
  AgencyClientsProjectionV2,
  AgencyClientsProjectionV2DocumentType
} from '../../../src/models/AgencyClientsProjectionV2';
import {get} from 'lodash';

export class AgencyClientsProjectionScenarios {
  static async createRecord(document: {
    [key in string]: any;
  }): Promise<AgencyClientsProjectionV2DocumentType> {
    return await AgencyClientsProjectionV2.create({
      agency_id: get(document, 'agency_id', '6141d5be5863dc2202000001'),
      client_id: get(document, 'client_id', '6141d64365e0e52381000001'),
      organisation_id: get(document, 'organisation_id', '6141d6bf9811943bf4000001'),
      site_id: get(document, 'site_id', '6141d6ce93cb867b35000001'),
      client_type: get(document, 'client_type', 'ward'),
      linked: get(document, 'linked', true)
    });
  }

  static async removeAll(): Promise<void> {
    await AgencyClientsProjectionV2.deleteMany({}).exec();
  }
}
