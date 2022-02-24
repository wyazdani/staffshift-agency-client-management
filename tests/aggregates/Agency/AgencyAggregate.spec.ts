import {AgencyAggregate} from '../../../src/aggregates/Agency/AgencyAggregate';
import {assert} from 'chai';
import {ResourceNotFoundError} from 'a24-node-error-utils';
import {AgencyConsultantRoleEnum, AgencyAggregateRecordInterface} from '../../../src/aggregates/Agency/types';

describe('AgencyAggregate class', () => {
  describe('validateUpdateConsultantRole()', () => {
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

      aggregate.validateUpdateConsultantRole('some-id');
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

      assert.throws(() => aggregate.validateUpdateConsultantRole('some-id'), ResourceNotFoundError);
    });
  });

  describe('canEnableConsultantRole()', () => {
    it('Test consultant role enabled', () => {
      const projection: AgencyAggregateRecordInterface = {
        last_sequence_id: 2,
        consultant_roles: [
          {
            _id: '61948046abd55b1a8ec55671',
            name: 'abc',
            description: 'description',
            max_consultants: 2,
            status: AgencyConsultantRoleEnum.AGENCY_CONSULTANT_ROLE_STATUS_DISABLED
          }
        ]
      };
      const aggregate = new AgencyAggregate({agency_id: 'id'}, projection);

      assert.isTrue(aggregate.canEnableConsultantRole('61948046abd55b1a8ec55671'), 'Expected to enable');
    });

    it('Test consultant role not to be enabled', () => {
      const projection: AgencyAggregateRecordInterface = {
        last_sequence_id: 2,
        consultant_roles: [
          {
            _id: '61948046abd55b1a8ec55671',
            name: 'abc',
            description: 'description',
            max_consultants: 2,
            status: AgencyConsultantRoleEnum.AGENCY_CONSULTANT_ROLE_STATUS_ENABLED
          }
        ]
      };
      const aggregate = new AgencyAggregate({agency_id: 'id'}, projection);

      assert.isFalse(aggregate.canEnableConsultantRole('61948046abd55b1a8ec55671'), 'Expected not to enable');
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
              max_consultants: 2,
              status: AgencyConsultantRoleEnum.AGENCY_CONSULTANT_ROLE_STATUS_DISABLED
            }
          ],
          last_sequence_id: 10
        }
      );

      assert.throws(() => aggregate.canEnableConsultantRole('some-id'), ResourceNotFoundError);
    });
  });

  describe('canDisableConsultantRole()', () => {
    it('Test consultant role disabled', () => {
      const projection: AgencyAggregateRecordInterface = {
        last_sequence_id: 2,
        consultant_roles: [
          {
            _id: '61948046abd55b1a8ec55671',
            name: 'abc',
            description: 'description',
            max_consultants: 2,
            status: AgencyConsultantRoleEnum.AGENCY_CONSULTANT_ROLE_STATUS_ENABLED
          }
        ]
      };
      const aggregate = new AgencyAggregate({agency_id: 'id'}, projection);

      assert.isTrue(aggregate.canDisableConsultantRole('61948046abd55b1a8ec55671'), 'Expected to disable');
    });

    it('Test consultant role not to be disabled', () => {
      const projection: AgencyAggregateRecordInterface = {
        last_sequence_id: 2,
        consultant_roles: [
          {
            _id: '61948046abd55b1a8ec55671',
            name: 'abc',
            description: 'description',
            max_consultants: 2,
            status: AgencyConsultantRoleEnum.AGENCY_CONSULTANT_ROLE_STATUS_DISABLED
          }
        ]
      };
      const aggregate = new AgencyAggregate({agency_id: 'id'}, projection);

      assert.isFalse(aggregate.canDisableConsultantRole('61948046abd55b1a8ec55671'), 'Expected to not to disabled');
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
              max_consultants: 2,
              status: AgencyConsultantRoleEnum.AGENCY_CONSULTANT_ROLE_STATUS_ENABLED
            }
          ],
          last_sequence_id: 10
        }
      );

      assert.throws(() => aggregate.canDisableConsultantRole('some-id'), ResourceNotFoundError);
    });
  });

  describe('getConsultantRole()', function () {
    it('should return undefined when role is not found', function () {
      const agencyAggregate = new AgencyAggregate(
        {agency_id: 'id'},
        {
          consultant_roles: [],
          last_sequence_id: 10
        }
      );
      const consultantRoleId = '123';

      assert.isUndefined(agencyAggregate.getConsultantRole(consultantRoleId));
    });

    it('should return consultant role found', function () {
      const consultantRoleId = '123';
      const role = {
        _id: consultantRoleId,
        name: 'now',
        description: 'wow',
        max_consultants: 1
      };
      const agencyAggregate = new AgencyAggregate(
        {agency_id: 'id'},
        {
          consultant_roles: [role],
          last_sequence_id: 10
        }
      );

      assert.deepEqual(agencyAggregate.getConsultantRole(consultantRoleId), role, 'incorrect consultant role returned');
    });
  });

  describe('getConsultantRoles()', function () {
    it('should return all consultant roles', function () {
      const role1 = {
        _id: '123',
        name: 'now',
        description: 'wow',
        max_consultants: 1
      };
      const role2 = {
        _id: '333',
        name: 'new',
        description: 'well',
        max_consultants: 1
      };
      const agencyAggregate = new AgencyAggregate(
        {agency_id: 'id'},
        {
          consultant_roles: [role1, role2],
          last_sequence_id: 10
        }
      );

      assert.deepEqual(agencyAggregate.getConsultantRoles(), [role1, role2], 'incorrect roles returned');
    });
  });

  describe('getId()', function () {
    it('should return aggregate id', function () {
      const agencyAggregate = new AgencyAggregate(
        {agency_id: 'id'},
        {
          consultant_roles: [],
          last_sequence_id: 10
        }
      );

      assert.deepEqual(agencyAggregate.getId(), {agency_id: 'id'}, 'incorrect aggregate id returned');
    });
  });

  describe('getLastEventId()', function () {
    it('should return last event id', function () {
      const agencyAggregate = new AgencyAggregate(
        {agency_id: 'id'},
        {
          consultant_roles: [],
          last_sequence_id: 10
        }
      );

      assert.equal(agencyAggregate.getLastEventId(), 10, 'incorrect last sequence id returned');
    });
  });

  describe('toJSON()', function () {
    it('should return the aggregate', function () {
      const aggregate = {
        consultant_roles: [
          {
            _id: '333',
            name: 'new',
            description: 'well',
            max_consultants: 1
          }
        ],
        last_sequence_id: 10
      };
      const agencyAggregate = new AgencyAggregate({agency_id: 'id'}, aggregate);

      assert.deepEqual(agencyAggregate.toJSON(), aggregate, 'Incorrect aggregate returned');
    });
  });
});
