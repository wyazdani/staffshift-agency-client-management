import {assert} from 'chai';
import {IfMatchHelper} from '../../src/helpers/IfMatchHelper';

describe('IfMatchHelper', () => {
  describe('getAggregateVersion()', () => {
    const input = 'W/"booking_preference:5"';

    it('should return booking_preference version', () => {
      const version = IfMatchHelper.getAggregateVersion(input, 'booking_preference');

      assert.deepEqual(version, 5);
    });

    it('should return zero_value', () => {
      const version = IfMatchHelper.getAggregateVersion(input, 'zero_value');

      assert.deepEqual(version, undefined);
    });

    it('should return zero_value for bogus string', () => {
      const version = IfMatchHelper.getAggregateVersion('bogus', 'zero_value');

      assert.deepEqual(version, undefined);
    });
  });
});
