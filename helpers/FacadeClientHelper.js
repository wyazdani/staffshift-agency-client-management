'use strict';

const config = require('config');
const StaffshiftFacadeClient = require('a24-node-staffshift-facade-client');
const {ValidationError, AuthorizationError, RuntimeError} = require('a24-node-error-utils');
const ClientHelper = require('./ClientHelper');
const clientConfig = config.get('a24-staffshift-facade');

/**
 * Facade client helper
 *
 * Will expose the client functions to the rest of the application
 */
class FacadeClientHelper {

  /**
   * Constructor
   *
   * @param {LoggerContext} logger - A logger object
   */
  constructor(logger) {
    this.logger = logger;
  }

  /**
   * Retrieve the agency site client details
   *
   * @param {string} agencyId - The agency Id
   * @param {string} organisationId - The organisation Id
   * @param {string} siteId - The site Id
   * @param {Object} options - Optional request parameters like xRequestId
   *
   * @return Promise<Object>
   */
  async getAgencySiteClientDetails(agencyId, organisationId, siteId, options) {
    if (!options) {
      options = {
        'xRequestId': this.logger.requestId,
        agencyId: agencyId,
        organisationId: organisationId,
        siteId: siteId
      };
    }

    const client = FacadeClientHelper.getInstance();
    const api = new StaffshiftFacadeClient.AgencyOrganisationLinkApi(client);
    const authorization = `token ${clientConfig.api_token}`;

    this.logger.debug('The candidate system details GET call to staffshift facade service has started');
    return new Promise((resolve, reject) => {
      api.listAgencyOrganisationLink(authorization, options, (error, data, response) => {
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
  async getAgencyClientDetails(agencyId, organisationId, siteId, wardId, options) {
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
    this.logger.debug('The candidate system details GET call to staffshift facade service has started');
    return new Promise((resolve, reject) => {
      api.listAgencyOrganisationLink(authorization, options, (error, data, response) => {
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

  /**
   * Gets a agency's details from staffshift-facade
   *
   * @param {String} agencyId - The agency id
   *
   * @returns Boolean
   */
  async getAgencyDetailsFromId(agencyId) {
    const client = FacadeClientHelper.getInstance();
    const api = new StaffshiftFacadeClient.AgencyApi(client);
    const tokenAuthorization = `token ${clientConfig.api_token}`;

    let options = {
      'xRequestId': this.logger.requestId
    };

    this.logger.debug('The agency details GET call to a24-staffshift-facade has started');
    return new Promise((resolve, reject) => {
      api.getAgency(agencyId, tokenAuthorization, options, (error, data, response) => {
        let item = null;
        if (error) {
          if (response) {
            switch (response.statusCode) {
              case 400:
                return reject(
                  ClientHelper.deserializeStatusCode400(client, StaffshiftFacadeClient.GetValidationErrorModel, response)
                );
              case 401:
                return reject(ClientHelper.authorizationError());
              case 404:
                return reject(ClientHelper.resourceNotFoundError(response));
              default: {
                const errorMsg = `Unexpected response code [${response.statusCode}] was returned while calling a24-staffshift-facade`;
                const item = ClientHelper.deserializeServerError(client, error, response, StaffshiftFacadeClient.ServerErrorModel);
                return reject(new RuntimeError(errorMsg, item));
              }
            }
          }

          item = new RuntimeError('An error occurred during the agency details GET call to a24-staffshift-facade', error);
          return reject(item);
        }
        this.logger.debug('The agency details GET call to a24-staffshift-facade has been completed successfully');
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

module.exports = {FacadeClientHelper};
