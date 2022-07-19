import {
  AgencyClientsProjectionV2,
  AgencyClientsProjectionV2DocumentType
} from '../../../models/AgencyClientsProjectionV2';

export class AgencyClientProjectionRepository {
  static async getAllLinkedSites(
    agencyId: string,
    organisationId: string
  ): Promise<AgencyClientsProjectionV2DocumentType[]> {
    return await AgencyClientsProjectionV2.find({
      agency_id: agencyId,
      organisation_id: organisationId,
      client_type: 'site',
      linked: true
    }).exec();
  }

  static async getAllLinkedWards(
    agencyId: string,
    organisationId: string,
    siteId: string
  ): Promise<AgencyClientsProjectionV2DocumentType[]> {
    return await AgencyClientsProjectionV2.find({
      agency_id: agencyId,
      organisation_id: organisationId,
      site_id: siteId,
      client_type: 'ward',
      linked: true
    }).exec();
  }

  /**
   * @TODO: complete jsdoc
   *
   * it contains the node itself too
   *
   * also explain we estimate not counting inherited|not-inherited
   *
   */
  static async getChildEstimatedCount(
    agencyId: string,
    organisationId: string,
    clientId: string,
    clientType: string
  ): Promise<number> {
    if (clientType === 'ward') {
      return 1;
    }
    return await AgencyClientsProjectionV2.countDocuments({
      agency_id: agencyId,
      organisation_id: organisationId,
      ...(clientType === 'site' && {site_id: clientId}),
      linked: true
    }).exec();
  }
}
