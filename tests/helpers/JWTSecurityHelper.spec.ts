import {sign} from 'jsonwebtoken';
import {assert} from 'chai';
import {JWTSecurityHelper} from '../../src/helpers/JWTSecurityHelper';
import {AuthorizationError} from 'a24-node-error-utils';
import sinon from 'ts-sinon';

describe('JWTSecurityHelper', () => {
  const secret = 'work';
  const payload = {
    iss: 'apig',
    sub: '5cf50a3ee8a73a14e34b32d2',
    request_id: '4010'
  };
  let testToken: string;

  beforeEach((done) => {
    sign(payload, secret, {noTimestamp: true}, (error, token) => {
      if (error) {
        return done(error);
      }
      testToken = token;
      done();
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('jwtVerification()', () => {
    it('should return the expected token payload on success', (done) => {
      JWTSecurityHelper.jwtVerification(testToken, secret, (error, results) => {
        if (error) {
          done(error);
        }

        assert.deepEqual(results, {token: testToken, decoded: payload});
        done();
      });
    });

    it('should return AuthorizationError when token verification failed', (done) => {
      JWTSecurityHelper.jwtVerification(testToken, 'wrong-secret', (error) => {
        assert.instanceOf(error, AuthorizationError, 'Incorrect error returned');
        done();
      });
    });
  });
});
