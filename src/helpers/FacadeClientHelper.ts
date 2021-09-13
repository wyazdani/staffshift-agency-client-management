
import {LoggerContext} from 'a24-logzio-winston';

const config = require('config');
const StaffshiftFacadeClient = require('a24-node-staffshift-facade-client');
const {ValidationError, AuthorizationError, RuntimeError} = require('a24-node-error-utils');
const clientConfig = config.get('a24-staffshift-facade');

interface FacadeClientRecord {
  _id: string,
  organisation_name: string,
  organisation_id: string,
  agency_name: string,
  agency_id: string,
  agency_org_type: string,
  agency_linked?: boolean
  //There are a lot of fields in the response. but i only added required and the ones that we used in code
}

interface GetAgencyClientDetailsOptions {
  xRequestId: string,
  agencyId: string,
  organisationId: string,
  agencyOrgType: string,
  siteId?: string,
  wardId?: string
}

/**
 * Facade client helper
 *
 * Will expose the client functions to the rest of the application
 */
export class FacadeClientHelper {
  /**
   * Constructor
   *
   * @param {LoggerContext} logger - A logger object
   */
  constructor(private logger: LoggerContext) {
  }

  /**
   * Retrieve the agency ward client details
   *
   * @param {string} agencyId - The agency Id
   * @param {string} organisationId - The organisation Id
   * @param {string} siteId (Optional) - The site Id
   * @param {string} wardId (Optional) - The ward Id
   * @param {Object} options (Optional) - Request parameters like xRequestId
   *
   * @return Promise<Object>
   */
  async getAgencyClientDetails(agencyId: string, organisationId: string, siteId: string, wardId: string, options?: GetAgencyClientDetailsOptions): Promise<FacadeClientRecord[]> {
    if (!options) {
      options = {
        'xRequestId': this.logger.requestId,
        agencyId: agencyId,
        organisationId: organisationId,
        agencyOrgType: 'organisation'
      };
    }
    if (siteId) {
      options['siteId'] = siteId;
      options['agencyOrgType'] = 'site';
    }
    if (wardId) {
      options['wardId'] = wardId;
      options['agencyOrgType'] = 'ward';
    }

    const client = FacadeClientHelper.getInstance();
    const api = new StaffshiftFacadeClient.AgencyOrganisationLinkApi(client);
    const authorization = `token ${clientConfig.api_token}`;
    this.logger.debug('The candidate system details GET call to staffshift facade service has started', {options});
    return new Promise((resolve: Function, reject: Function) => {
      api.listAgencyOrganisationLink(authorization, options, (error: any, data: any, response: any) => {
        let item = null;
        if (error) {
          if (response) {
            if (response.statusCode === 400) {
              item = client.deserialize(response, StaffshiftFacadeClient.GetValidationErrorModel);
              const validationError = new ValidationError(
                item.message,
                item.errors
              );
              return reject(validationError);
            }
            if (response.statusCode === 401) {
              const authorizationError = new AuthorizationError('Invalid token specified');
              return reject(authorizationError);
            }

            if (response.statusCode === 404) {
              return resolve();
            }

            item = client.deserialize(response, StaffshiftFacadeClient.ServerErrorModel);
            return reject(item);
          }
          item = new RuntimeError('An error occurred during the candidate system details data get call', error);
          return reject(item);
        }
        this.logger.debug(
          'The candidate system details GET call to staffshift facade service has been completed successfully',
          {body: response.body}
        );
        return resolve(response.body);
      });
    });
  }

  static getInstance() {
    const client = new StaffshiftFacadeClient.ApiClient();
    const requestOptions = clientConfig.request_options;
    client.basePath = `${requestOptions.protocol}://${requestOptions.host}:${requestOptions.port}/${requestOptions.version}`;
    return client;
  }
}
