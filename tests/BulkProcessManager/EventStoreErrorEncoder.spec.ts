import {EventStoreErrorEncoder} from '../../src/BulkProcessManager/EventStoreErrorEncoder';
import {ValidationError, RuntimeError} from 'a24-node-error-utils';

describe('EventStoreErrorEncoder', () => {
  describe('encodeArray()', () => {
    it('Test encodes normal error', () => {
      const error = new Error('sample');
      const result = EventStoreErrorEncoder.encodeArray([error]);

      result.should.deep.equal([
        {
          code: 'UNKNOWN_ERROR',
          message: 'sample'
        }
      ]);
    });
    it('Test encodes error code', () => {
      const error: any = new Error('sample');

      error.code = 'oops';
      const result = EventStoreErrorEncoder.encodeArray([error]);

      result.should.deep.equal([
        {
          code: 'oops',
          message: 'sample'
        }
      ]);
    });
    it('Test Validation Error', () => {
      const originalError = new Error('sample');
      const validationError = new ValidationError(
        'Error parsing aggregate id',
        [
          {
            code: 'INVALID_AGGREGATE_ID',
            message: 'Could not parse aggregate id',
            path: ['aggregate_id']
          }
        ],
        originalError
      );
      const result = EventStoreErrorEncoder.encodeArray([validationError]);

      result.should.deep.equal([
        {
          code: 'MODEL_VALIDATION_FAILED',
          status: 400,
          message: 'Error parsing aggregate id',
          originalError: {
            code: 'UNKNOWN_ERROR',
            message: 'sample'
          },
          errors: [
            {
              code: 'INVALID_AGGREGATE_ID',
              message: 'Could not parse aggregate id',
              path: ['aggregate_id']
            }
          ]
        }
      ]);
    });
    it('Test Runtime Error', () => {
      const originalError = new Error('sample');
      const runtimeError = new RuntimeError('oops runtime', originalError);
      const result = EventStoreErrorEncoder.encodeArray([runtimeError]);

      result.should.deep.equal([
        {
          code: 'RUNTIME_ERROR',
          status: 500,
          message: 'oops runtime',
          originalError: {
            code: 'UNKNOWN_ERROR',
            message: 'sample'
          }
        }
      ]);
    });
  });
});
