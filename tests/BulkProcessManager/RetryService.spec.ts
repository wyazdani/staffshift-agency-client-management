import sinon from 'ts-sinon';
import {RetryService, RetryableError, NonRetryableError} from '../../src/BulkProcessManager/RetryService';

describe('RetryService', () => {
  afterEach(() => {
    sinon.restore();
  });
  describe('exec() and getErrors()', () => {
    it('Test retry works for retryable errors', async () => {
      const service = new RetryService(2, 10);
      const error = new Error('sample');
      const func = sinon.stub().throws(new RetryableError(error));

      await service.exec(func).should.be.rejected;
      service.getErrors().should.deep.equal([error, error, error]);
      func.should.have.been.calledThrice;
    });
    it('Test not retry for non-retryable errors', async() => {
      const service = new RetryService(2, 10);
      const error = new Error('sample');
      const func = sinon.stub().throws(new NonRetryableError(error));

      await service.exec(func).should.be.rejected;
      service.getErrors().should.deep.equal([error]);
      func.should.have.been.calledOnce;
    });
  });
});
