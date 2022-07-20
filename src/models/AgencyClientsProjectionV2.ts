import {Document, Schema, model, Model} from 'mongoose';

export type AgencyClientsProjectionV2DocumentType = Document & {
  agency_id: string;
  client_id: string;
  organisation_id: string;
  site_id: string;
  client_type: string;
  linked: boolean;
  created_at: Date;
  updated_at: Date;
};

interface AgencyClientsProjectionV2ModelInterface extends Model<AgencyClientsProjectionV2DocumentType> {
  getAllLinkedSites(agencyId: string, organisationId: string): Promise<AgencyClientsProjectionV2DocumentType[]>;
  getAllLinkedWards(
    agencyId: string,
    organisationId: string,
    siteId: string
  ): Promise<AgencyClientsProjectionV2DocumentType[]>;
  getEstimatedCount(agencyId: string, organisationId: string, clientId: string, clientType: string): Promise<number>;
}

const agencyClients = new Schema<AgencyClientsProjectionV2DocumentType, AgencyClientsProjectionV2ModelInterface>(
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
    organisation_id: {
      type: String,
      required: false,
      description: 'The organisation id'
    },
    site_id: {
      type: String,
      required: false,
      description: 'The site id'
    },
    client_type: {
      type: String,
      required: true,
      description: 'The client type details'
    },
    linked: {
      type: Boolean,
      required: true,
      description: 'Flag indicating if the client is actually linked'
    }
  },
  {
    versionKey: false,
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    collection: 'AgencyClientsProjectionV2'
  }
);

agencyClients.static({
  // eslint-disable-next-line func-names
  2: async function (
    agencyId: string,
    organisationId: string
  ): Promise<AgencyClientsProjectionV2DocumentType[]> {
    return await this.find({
      agency_id: agencyId,
      organisation_id: organisationId,
      client_type: 'site',
      linked: true
    }).exec();
  },
  // eslint-disable-next-line func-names
  getAllLinkedWards: async function (
    agencyId: string,
    organisationId: string,
    siteId: string
  ): Promise<AgencyClientsProjectionV2DocumentType[]> {
    return await this.find({
      agency_id: agencyId,
      organisation_id: organisationId,
      site_id: siteId,
      client_type: 'ward',
      linked: true
    }).exec();
  },
  /**
   * find estimated count using the projection.
   * It counts all children and grandchildren of a node
   * it contains the node itself too
   *
   * also explain we estimate not counting inherited|not-inherited
   *
   */
  // eslint-disable-next-line func-names
  getEstimatedCount: async function (
    agencyId: string,
    organisationId: string,
    clientId: string,
    clientType: string
  ): Promise<number> {
    if (clientType === 'ward') {
      return 1;
    }
    return await this.countDocuments({
      agency_id: agencyId,
      organisation_id: organisationId,
      ...(clientType === 'site' && {site_id: clientId}),
      linked: true
    }).exec();
  }
});

/**
 * Defines the model for the AgencyClients Read Projection
 */
export const AgencyClientsProjectionV2 = model<
  AgencyClientsProjectionV2DocumentType,
  AgencyClientsProjectionV2ModelInterface
>('AgencyClientsProjectionV2', agencyClients);
