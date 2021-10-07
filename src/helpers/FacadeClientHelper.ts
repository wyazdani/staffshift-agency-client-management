import {LoggerContext} from 'a24-logzio-winston';
import config from 'config';
import StaffshiftFacadeClient, {
  AgencyOrganisationLinkDataType,
  ApiClient,
  ListAgencyOrgLinkOptionsType
} from 'a24-node-staffshift-facade-client';
import {ValidationError, AuthorizationError, RuntimeError} from 'a24-node-error-utils';
import {HttpServiceConfigurationInterface} from 'HttpServiceConfigurationInterface';

const clientConfig = config.get<HttpServiceConfigurationInterface>('a24-staffshift-facade');

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
  constructor(private logger: LoggerContext) {}

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
  async getAgencyClientDetails(
    agencyId: string,
    organisationId: string,
    siteId?: string,
    wardId?: string,
    options?: ListAgencyOrgLinkOptionsType
  ): Promise<AgencyOrganisationLinkDataType[]> {
    if (!options) {
      options = {
        xRequestId: this.logger.requestId,
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

    this.logger.debug('The agency client GET call to staffshift facade service has started', {options});

    return new Promise(
      (resolve: (body?: AgencyOrganisationLinkDataType[]) => void, reject: (error?: Error) => void) => {
        api.listAgencyOrganisationLink(authorization, options, (error, data, response) => {
          let item = null;

          if (error) {
            if (response) {
              if (response.statusCode === 400) {
                item = client.deserialize(response, StaffshiftFacadeClient.GetValidationErrorModel);
                const validationError = new ValidationError(item.message, item.errors);

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

              return reject(new RuntimeError(item.message, error));
            }
            item = new RuntimeError('An error occurred during the agency client data get call', error);

            return reject(item);
          }
          this.logger.debug('The agency client GET call to staffshift facade service has been completed successfully', {
            body: response.body
          });

          return resolve(response.body);
        });
      }
    );
  }

  /**
   * Retrieve the ALL agency client details
   *
   * @return Promise<Object>
   */
  async getAgencyClientDetailsListing(options?: ListAgencyOrgLinkOptionsType): Promise<any> {
    options = {...options, xRequestId: this.logger.requestId};
    const client = FacadeClientHelper.getInstance();
    const api = new StaffshiftFacadeClient.AgencyOrganisationLinkApi(client);
    const authorization = `token ${clientConfig.api_token}`;

    this.logger.debug('The agency client GET call to staffshift facade service has started', {options});

    return new Promise(
      (resolve: (results?: AgencyOrganisationLinkDataType[]) => void, reject: (error: Error) => void) => {
        api.listAgencyOrganisationLink(authorization, options, (error, data, response) => {
          let item = null;

          if (error) {
            if (response) {
              if (response.statusCode === 400) {
                item = client.deserialize(response, StaffshiftFacadeClient.GetValidationErrorModel);
                const validationError = new ValidationError(item.message, item.errors);

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

              return reject(new RuntimeError(item.message, error));
            }
            item = new RuntimeError('An error occurred during the agency client data get call', error);

            return reject(item);
          }
          this.logger.debug('The agency client GET call to staffshift facade service has been completed successfully', {
            body: response.body
          });

          return resolve(response.body);
        });
      }
    );
  }

  /**
   * Configure and return staffshift facade client instance
   */
  static getInstance(): ApiClient {
    const client = new StaffshiftFacadeClient.ApiClient();
    const requestOptions = clientConfig.request_options;

    client.basePath = `${requestOptions.protocol}://${requestOptions.host}:${requestOptions.port}/${requestOptions.version}`;
    client.timeout = clientConfig.request_timeout;
    return client;
  }
}
