
const JWT = require('jsonwebtoken');
const {AuthorizationError} = require('a24-node-error-utils');
import _ from 'lodash';

/**
 * This module contains methods that assists with swaggers security
 * and JWT verification.
 *
 * @module SecurityHelper
 */
export class JWTSecurityHelper {
  /**
   * Verify the JWT token with the secret
   *
   * @param {object} req - The request object
   * @param {object} token - The token passed to the helper
   * @param {object} secret - The secret specified by the api
   * @param {function} next - The next callback with structure function(err)
   *
   * @author Ruan <ruan.robson@a24group.com>
   * @since  30 July 2021
   */
  static jwtVerification(req: any, token: any, secret: any, next: Function) {
    JWT.verify(token, secret, function validate(err: any, decoded: any) {
      if (err) {
        return next(new AuthorizationError('Invalid token specified'));
      }
      _.set(req, 'authentication.jwt.token', token);
      _.set(req, 'authentication.jwt.payload', decoded);
      return next();
    });
  }
}