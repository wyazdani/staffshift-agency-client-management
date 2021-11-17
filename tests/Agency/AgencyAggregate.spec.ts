import {AgencyAggregate} from '../../src/Agency/AgencyAggregate';
import {assert} from 'chai';
import {ResourceNotFoundError} from 'a24-node-error-utils';
import {AgencyAggregateRecordInterface} from '../../src/Agency/types';
import {AgencyConsultantRoleEnum} from '../../src/Agency/types/AgencyConsultantRoleEnum';

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
    it('Test success scenario', () => {
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
      const aggregate = new AgencyAggregate(
        {agency_id: 'id'},
        projection
      );

      aggregate.canEnableConsultantRole('61948046abd55b1a8ec55671');
    });

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
      const aggregate = new AgencyAggregate(
        {agency_id: 'id'},
        projection
      );
      assert(aggregate.canEnableConsultantRole('61948046abd55b1a8ec55671') == true, 'Expected to enable')
      
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
      const aggregate = new AgencyAggregate(
        {agency_id: 'id'},
        projection
      );
      assert(aggregate.canEnableConsultantRole('61948046abd55b1a8ec55671') == false, 'Expected to not to enable')
      
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
    it('Test success scenario', () => {
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
      const aggregate = new AgencyAggregate(
        {agency_id: 'id'},
        projection
      );

      aggregate.canDisableConsultantRole('61948046abd55b1a8ec55671');
    });

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
      const aggregate = new AgencyAggregate(
        {agency_id: 'id'},
        projection
      );
      assert(aggregate.canDisableConsultantRole('61948046abd55b1a8ec55671') == true, 'Expected to disable')
      
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
      const aggregate = new AgencyAggregate(
        {agency_id: 'id'},
        projection
      );
      assert(aggregate.canDisableConsultantRole('61948046abd55b1a8ec55671') == false, 'Expected to not to disabled')
      
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
});
