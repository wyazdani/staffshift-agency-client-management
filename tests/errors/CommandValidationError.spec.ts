import {AbstractError} from 'a24-node-error-utils';
import {CommandValidationError} from '../../src/errors/CommandValidationError';
import {CommandValidationFormatter} from '../../src/errors/CommandValidationFormatter';

describe('CommandValidationError', () => {
  it('Test public properties', () => {
    const error = new CommandValidationError('sample');

    error.should.be.instanceOf(AbstractError);
    error.status.should.equal(500);
    error.code.should.equal('COMMAND_VALIDATION_ERROR');
    error.formatter.should.be.instanceOf(CommandValidationFormatter);
  });

  it('Test setSchemaErrors()', () => {
    const error = new CommandValidationError('sample');

    error.setSchemaErrors([
      {
        message: 'sample',
        code: 'ok',
        params: ['oops'],
        path: 'sample path',
        description: 'desc',
        inner: []
      }
    ]);
    error.schemaErrors.should.deep.equal([
      {
        message: 'sample',
        code: 'ok',
        params: ['oops'],
        path: 'sample path',
        description: 'desc',
        inner: []
      }
    ]);
  });
});
