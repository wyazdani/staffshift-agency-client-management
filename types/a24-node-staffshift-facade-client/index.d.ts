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

  export type AgencyOrganisationLinkDataType = {
    _id: string;
    organisation_name: string;
    organisation_id: string;
    agency_name: string;
    agency_id: string;
    agency_org_type: string;
    agency_linked?: boolean;
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
