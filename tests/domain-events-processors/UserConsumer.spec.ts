import {SinonStub} from 'sinon';
import sinon from 'ts-sinon';
import {assert} from 'chai';
import {LoggerContext} from 'a24-logzio-winston';
import {ConsultantNameChangeProcessor} from '../../src/domain-events-processors/ConsultantNameChangeProcessor';
import {TestUtilsLogger} from '../tools/TestUtilsLogger';
/*eslint-disable*/
const process = require('../../src/domain-events-processors/UserConsumer');
/*eslint-enable*/

describe('UserConsumer', () => {
  let logger: LoggerContext;
  let processStub: SinonStub;

  beforeEach(() => {
    logger = TestUtilsLogger.getLogger(sinon.spy());
    processStub = sinon.stub(ConsultantNameChangeProcessor.prototype, 'process');
  });
  afterEach(() => {
    sinon.restore();
  });

  describe('process()', () => {
    const data = {
      user_id: 'AAA'
    };
    const message = {
      application_jwt: 'hello',
      event: {
        name: 'user_updated'
      },
      event_data: data
    };
    const messageMeta = {
      someField: 'blah'
    };

    it('Test Success calling Consultant Name Change Processor', (done) => {
      processStub.resolves();
      process(logger, message, messageMeta, (param: Error) => {
        processStub.should.have.been.calledWith(data);
        assert.isUndefined(param);
        done();
      });
    });

    it('Test Failure calling Consultant Name Change Processor', (done) => {
      const error = new Error('sample');

      processStub.rejects(error);

      process(logger, message, messageMeta, (param: Error) => {
        processStub.should.have.been.calledWith(data);
        param.should.equal(error);
        done();
      });
    });
  });
});
