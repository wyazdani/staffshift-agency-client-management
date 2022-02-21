import {
  AgencyClientConsultantsProjectionV3,
  AgencyClientConsultantV3DocumentType
} from '../../../src/models/AgencyClientConsultantsProjectionV3';
import {get} from 'lodash';

export class AgencyClientConsultantsProjectionScenarios {
  static async createRecord(document: {
    [key in string]: string | boolean | Date;
  }): Promise<AgencyClientConsultantV3DocumentType> {
    return await AgencyClientConsultantsProjectionV3.create({
      agency_id: get(document, 'agency_id', '6141d5be5863dc2202000001'),
      client_id: get(document, 'client_id', '6141d64365e0e52381000001'),
      consultant_id: get(document, 'consultant_id', '6141d64365e0e52381000123'),
      consultant_name: get(document, 'consultant_name', 'Some Name'),
      consultant_role_id: get(document, 'consultant_role_id', '6141d6bf9811943bf4000001'),
      consultant_role_name: get(document, 'consultant_role_name', 'some role name')
    });
  }

  static async removeAll(): Promise<void> {
    await AgencyClientConsultantsProjectionV3.deleteMany({}).exec();
  }
}
