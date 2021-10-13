declare module 'a24-node-staffshift-facade-client' {
  import {Response} from 'superagent';

  interface GetValidationErrorModelInterface extends Error {
    code: string;
  }

  interface ServerErrorModelInterface extends Error {
    code: string;
  }

  export const GetValidationErrorModel: GetValidationErrorModelInterface;

  export const ServerErrorModel: ServerErrorModelInterface;

  export type DeserializeReturnType = {
    code: string;
    message: string;
    errors?: string[];
  };

  export class ApiClient {
    basePath: string;
    timeout: number;

    deserialize(res: Response, errorModel: Error): DeserializeReturnType;
  }

  export type ListAgencyOrgLinkOptionsType = {
    xRequestId?: string;
    page?: number;
    itemsPerPage?: number;
    organisationName?: string;
    organisationId?: string;
    siteName?: string;
    siteId?: string;
    siteType?: string;
    siteTypeId?: string;
    wardName?: string;
    wardId?: string;
    wardType?: string;
    wardTypeId?: string;
    agencyName?: string;
    agencyId?: string;
    agencyLinked?: boolean;
    agencyOrgClientReference?: string;
    requiresPoNumber?: boolean;
    agencyOrgType?: string;
    requiresShiftReferenceNumber?: boolean;
    sortBy?: string[];
  };

  type CoordinatesType = {
    longitude: number;
    latitude: number;
  };

  export type AgencyOrganisationLinkDataType = {
    _id: string;
    organisation_name: string;
    organisation_id: string;
    agency_name: string;
    agency_id: string;
    agency_org_type: string;
    agency_linked?: boolean;
    site_name?: string;
    site_id?: string;
    site_type?: string;
    site_type_id?: string;
    site_address?: string;
    site_province?: string;
    site_post_code?: string;
    ward_name?: string;
    ward_id?: string;
    ward_type?: string;
    ward_type_id?: string;
    agency_org_client_reference?: string;
    requires_po_number?: boolean;
    authorise_client_contact_names?: string[];
    updated_at?: string;
    created_at?: string;
    site_geo_location?: {
      type: string;
      coordinates: CoordinatesType[];
    };
  };

  export type ClientRequestCallbackType = (
    err: Error | null,
    data: AgencyOrganisationLinkDataType[],
    response: Response
  ) => void;

  export class AgencyOrganisationLinkApi {
    constructor(client: ApiClient);
    public listAgencyOrganisationLink(
      authToken: string,
      reqOptions: ListAgencyOrgLinkOptionsType,
      cb: ClientRequestCallbackType
    ): void;
  }

  // User API:
  export type UserDetailsDataType = {
    user_id: string;
    first_name: string;
    last_name: string;
  };
  export type GetUserDetailsOptionsType = {
    xRequestId?: string;
  };
  export type ClientUserDetailsRequestCallbackType = (
    err: Error | null,
    data: UserDetailsDataType[],
    response: Response
  ) => void;

  export class UserApi {
    constructor(client: ApiClient);
    public getUserDetails(
      userId: string,
      authToken: string,
      reqOptions: GetUserDetailsOptionsType,
      cb: ClientUserDetailsRequestCallbackType
    ): void;
  }
}
