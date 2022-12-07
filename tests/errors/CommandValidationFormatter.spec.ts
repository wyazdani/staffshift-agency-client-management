import {DefaultErrorFormatter} from 'a24-node-error-utils';
import sinon from 'sinon';
import {CommandValidationError} from '../../src/errors/CommandValidationError';
import {CommandValidationFormatter} from '../../src/errors/CommandValidationFormatter';

describe('CommandValidationFormatter', () => {
  describe('formatLog()', () => {
    afterEach(() => {
      sinon.restore();
    });
    it('Test it attaches errors to default formatter', () => {
      const error = new CommandValidationError('not found').setSchemaErrors([
        {
          message: 'sample',
          code: 'ok',
          params: ['oops'],
          path: 'sample path',
          description: 'desc',
          inner: []
        }
      ]);
      const parentFormatLog = sinon.stub(DefaultErrorFormatter.prototype, 'formatLog').returns({
        sample: 'ok'
      });
      const formatter = new CommandValidationFormatter();

      formatter.should.be.instanceOf(DefaultErrorFormatter);
      const result = formatter.formatLog(error);

      result.should.deep.equal({
        sample: 'ok',
        schema_errors: [
          {
            message: 'sample',
            code: 'ok',
            params: ['oops'],
            path: 'sample path',
            description: 'desc',
            inner: []
          }
        ]
      });
      parentFormatLog.should.have.been.calledOnceWith(error);
    });
  });
});
