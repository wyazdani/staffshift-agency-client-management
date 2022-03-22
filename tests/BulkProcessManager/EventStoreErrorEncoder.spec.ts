import {EventStoreErrorEncoder} from '../../src/BulkProcessManager/EventStoreErrorEncoder';

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
  });
});
