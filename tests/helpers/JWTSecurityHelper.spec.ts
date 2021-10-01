import {sign} from 'jsonwebtoken';
import {assert} from 'chai';
import {JWTSecurityHelper} from '../../src/helpers/JWTSecurityHelper';
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
    sign(payload, secret, (error, token) => {
      if (error) {
        return done(error);
      }
      testToken = token;
      done();
    });
  });

  afterEach((done) => {
    sinon.restore();
  });

  describe('jwtVerification()', () => {
    it.skip('should return AuthorizationError when token verification failed', (done) => {
      JWTSecurityHelper.jwtVerification(testToken, secret, (error, results) => {
        if (error) {
          done(error);
        }
        delete results.decoded;
        assert.deepEqual(results, {token: testToken, decoded: payload});
        done();
      });
    });
  });
});
