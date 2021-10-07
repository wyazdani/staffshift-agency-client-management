import sinon from 'ts-sinon';
import {assert} from 'chai';
import {LoggerContext} from 'a24-logzio-winston';
import {TestUtilsLogger} from '../tools/TestUtilsLogger';
import {AgencyClientLinkStatus} from '../../src/domain-events-processors/AgencyClientLinkStatus';
import {JWTSecurityHelper} from '../../src/helpers/JWTSecurityHelper';
import {IncomingDomainEvents} from '../../src/models/IncomingDomainEvents';
/*eslint-disable*/
const process = require('../../src/domain-events-processors/Consumer');
/*eslint-enable*/

describe('Consumer', () => {
  let logger: LoggerContext;

  beforeEach(() => {
    logger = TestUtilsLogger.getLogger(sinon.spy());
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('process()', () => {
    const message = {
      application_jwt: 'hello',
      event: {
        name: 'agency_organisation_link_created'
      }
    };
    const messageMeta = {
      someField: 'blah'
    };

    it('should create the event entry in the incoming event collection', (done) => {
      const applyStub = sinon.stub(AgencyClientLinkStatus.prototype, 'apply');
      const jwtVerificationStub = sinon.stub(JWTSecurityHelper, 'jwtVerification');
      const createStub = sinon.stub(IncomingDomainEvents, 'create');
      const callback = sinon.spy((error) => {
        assert.isUndefined(error);
        applyStub.should.have.been.calledOnceWith(message);
        done();
      });

      jwtVerificationStub.callsFake((token, secret, cb) =>
        cb(null, {
          token: '6666',
          decoded: {
            sub: '10',
            client_id: '12345',
            request_id: '875',
            context: {
              id: '90',
              type: 'Agency'
            }
          }
        })
      );
      createStub.callsFake((data) => {
        assert.deepEqual(data, message, 'Incorrect event saved');
        return Promise.resolve();
      });
      applyStub.resolves();
      process(logger, message, messageMeta, callback);
    });

    it('should call the callback with an error if the call to create the entry fails', (done) => {
      const applyStub = sinon.stub(AgencyClientLinkStatus.prototype, 'apply');
      const jwtVerificationStub = sinon.stub(JWTSecurityHelper, 'jwtVerification');
      const createStub = sinon.stub(IncomingDomainEvents, 'create');
      const callback = sinon.spy((error) => {
        assert.equal(error.message, 'some error');
        applyStub.should.have.been.calledOnceWith(message);
        done();
      });

      jwtVerificationStub.callsFake((token, secret, cb) =>
        cb(null, {
          token: '6666',
          decoded: {
            sub: '10',
            client_id: '12345',
            request_id: '875',
            context: {
              id: '90',
              type: 'Agency'
            }
          }
        })
      );
      createStub.callsFake((data) => {
        assert.deepEqual(data, message, 'Incorrect event saved');
        return Promise.reject(new Error('some error'));
      });
      applyStub.resolves();
      process(logger, message, messageMeta, callback);
    });
  });
});
