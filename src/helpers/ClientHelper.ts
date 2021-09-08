const {ValidationError, AuthorizationError, ResourceNotFoundError, PermissionDenied} = require('a24-node-error-utils');
import _ from 'lodash';

export const ClientHelper = {
  /**
   * Deserialize status code 400 errors
   *
   * @param {ApiClient} client - The node client
   * @param {Model} model - The 400 error model for the service call
   * @param {ResponseDef} response - The  response
   *
   * @return {ValidationError}
   */
  deserializeStatusCode400: function deserializeStatusCode400(client: any, model: any, response: any) {
    const item = client.deserialize(response, model);
    return new ValidationError(item.message, item.errors);
  },

  /** Deserialize status code 500 errors
   *
   * @param {ApiClient} client - The node client
   * @param {Object} error - The downstream error
   * @param {Model} model - The 500 error model for the service call
   * @param {ResponseDef} response - The  response
   *
   * @return {Object}
   */
  deserializeServerError: function deserializeServerError(client: any, error: any, model: any, response: any) {
    let item = client.deserialize(response, model);
    if (_.isEmpty(item) || !item.code || !item.message) {
      item = JSON.parse(JSON.stringify(error));
      if (item.response && item.response.req) {
        delete item.response.req;
      }
    }
    return item;
  },

  /**
   * Authorization error
   *
   * @return {AuthorizationError}
   */
  authorizationError: function authorizationError() {
    return new AuthorizationError('Invalid token specified');
  },

  /**
   * ResourceNotFound error
   *
   * @return {ResourceNotFoundError}
   */
  resourceNotFoundError: function resourceNotFoundError(response: any) {
    const errorMsg = (response && response.body && response.body.message) ? response.body.message :  'Resource not found';
    return new ResourceNotFoundError(errorMsg);
  },

  /**
   * PermissionDenied error
   *
   * @return {PermissionDenied}
   */
  permissionDeniedError: function permissionDeniedError(response: any) {
    const errorMsg = (response && response.body && response.body.message) ? response.body.message :  'Permission denied';
    return new PermissionDenied(errorMsg);
  }
};