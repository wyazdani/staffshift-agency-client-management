import {SwaggerRequestInterface} from 'SwaggerRequestInterface';
import {AuthorizationError} from 'a24-node-error-utils';
import {verify} from 'jsonwebtoken';
import {set} from 'lodash';
import {GenericObjectInterface} from 'GenericObjectInterface';


interface DecodedJWTInterface {
  sub: string,
  request_id: string,
  client_id?: string,
  context?: {
    type: string
    id?: string
  }
}

export interface JWTVerificationInterface {
  token: string,
  decoded: {
    sub: string,
    request_id: string,
    client_id?: string,
    context?: {
      type: string
      id?: string
    }
  }
}

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
   * @param {object} token - The token passed to the helper
   * @param {object} secret - The secret specified by the api
   * @param {(error?: Error) => void} callback - A callback function
   *
   * @author Ruan <ruan.robson@a24group.com>
   * @since  30 July 2021
   */
  static jwtVerification(token: string, secret: string, callback: (err: Error, response?: JWTVerification) => void): void {
    JWT.verify(token, secret, function validate(err: Error, decoded: DecodedJWT) {
      if (err) {
        return callback(new AuthorizationError('Invalid token specified'));
      }
      return callback(null, {token, decoded});
    });
  }
}