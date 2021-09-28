import {AgencyAggregate} from '../../src/Agency/AgencyAggregate';
import {assert} from 'chai';
import {ResourceNotFoundError} from 'a24-node-error-utils';

describe('AgencyAggregate class', () => {
  describe('validateConsultantRoleExists()', () => {
    it('Test success scenario', () => {
      const aggregate = new AgencyAggregate(
        {agency_id: 'id'},
        {
          consultant_roles: [
            {
              _id: 'some-id',
              name: 'sss',
              description: 'ok',
              max_consultants: 2
            }
          ],
          last_sequence_id: 10
        }
      );

      aggregate.validateConsultantRoleExists('some-id');
    });

    it('Test failure scenario', () => {
      const aggregate = new AgencyAggregate(
        {agency_id: 'id'},
        {
          consultant_roles: [
            {
              _id: 'another-id',
              name: 'sss',
              description: 'ok',
              max_consultants: 2
            }
          ],
          last_sequence_id: 10
        }
      );

      assert.throws(() => aggregate.validateConsultantRoleExists('some-id'), ResourceNotFoundError);
    });
  });
});
