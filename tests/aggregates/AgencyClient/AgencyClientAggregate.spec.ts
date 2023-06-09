import {assert} from 'chai';
import {AgencyClientAggregate} from '../../../src/aggregates/AgencyClient/AgencyClientAggregate';
import {stubConstructor, stubInterface} from 'ts-sinon';
import {AgencyRepository} from '../../../src/aggregates/Agency/AgencyRepository';
import {AgencyAggregate} from '../../../src/aggregates/Agency/AgencyAggregate';
import {ValidationError, ResourceNotFoundError} from 'a24-node-error-utils';
import {AgencyConsultantRoleEnum} from '../../../src/aggregates/Agency/types';
import {AgencyClientConsultantInterface} from '../../../src/aggregates/AgencyClient/types';
import {TransferAgencyClientConsultantCommandDataInterface} from '../../../src/aggregates/AgencyClient/types/CommandDataTypes';

describe('AgencyClientAggregate', () => {
  describe('validateAddClientConsultant()', () => {
    const agencyId = '333';
    const roleId = '2020';
    const aggregateId = {
      agency_id: agencyId,
      client_id: '12'
    };
    const agencyAggregateId = {
      agency_id: agencyId
    };
    const consultant = {
      consultant_role_id: roleId,
      _id: '1010',
      consultant_id: '3030',
      client_type: 'site',
      site_id: '12345'
    };
    const aggregate = {
      last_sequence_id: 1,
      linked: true,
      client_type: 'site'
    };

    it('should return validation error when consultant role is not found', async () => {
      const AgencyAggregateStub = stubConstructor(AgencyAggregate);
      const agencyRepositoryStub = stubConstructor(AgencyRepository);

      agencyRepositoryStub.getAggregate.resolves(AgencyAggregateStub);
      AgencyAggregateStub.getConsultantRole.returns(undefined);
      const agencyClientAggregate = new AgencyClientAggregate(aggregateId, aggregate, agencyRepositoryStub);

      const error = await agencyClientAggregate
        .validateAddClientConsultant(consultant)
        .should.be.rejectedWith(ValidationError, 'Consultant role not found');

      error.assertEqual(
        new ValidationError('Consultant role not found').setErrors([
          {
            code: 'CONSULTANT_ROLE_NOT_FOUND',
            message: `Consultant role ${consultant.consultant_role_id} does not not exist`,
            path: ['consultant_role_id']
          }
        ])
      );
    });

    it('should return validation error when max consultants have been exceeded', async () => {
      const aggregate = {
        last_sequence_id: 1,
        linked: true,
        client_type: 'site',
        consultants: [consultant]
      };
      const consultantRole = {
        _id: '2020',
        name: 'ooh',
        description: 'blah',
        max_consultants: 1,
        status: AgencyConsultantRoleEnum.AGENCY_CONSULTANT_ROLE_STATUS_ENABLED
      };

      const AgencyAggregateStub = stubConstructor(AgencyAggregate);
      const agencyRepositoryStub = stubConstructor(AgencyRepository);

      agencyRepositoryStub.getAggregate.resolves(AgencyAggregateStub);
      AgencyAggregateStub.getConsultantRole.returns(consultantRole);
      const agencyClientAggregate = new AgencyClientAggregate(aggregateId, aggregate, agencyRepositoryStub);

      const error = await agencyClientAggregate
        .validateAddClientConsultant(consultant)
        .should.be.rejectedWith(ValidationError, 'Max consultants already assigned');

      error.assertEqual(
        new ValidationError('Max consultants already assigned').setErrors([
          {
            code: 'MAX_CONSULTANTS_ASSIGNED',
            message: `Max consultants already assigned for consultant role id: ${consultant.consultant_role_id}`,
            path: ['consultant_role_id']
          }
        ])
      );
      agencyRepositoryStub.getAggregate.should.have.been.calledOnceWith(agencyAggregateId);
      AgencyAggregateStub.getConsultantRole.should.have.been.calledOnceWith(roleId);
    });

    it('should return validation error when consultant already assigned for the role', async () => {
      const aggregate = {
        last_sequence_id: 1,
        linked: true,
        client_type: 'site',
        consultants: [consultant]
      };
      const consultantRole = {
        _id: '1010',
        name: 'ooh',
        description: 'blah',
        max_consultants: 2,
        status: AgencyConsultantRoleEnum.AGENCY_CONSULTANT_ROLE_STATUS_ENABLED
      };

      const AgencyAggregateStub = stubConstructor(AgencyAggregate);
      const agencyRepositoryStub = stubConstructor(AgencyRepository);

      agencyRepositoryStub.getAggregate.resolves(AgencyAggregateStub);
      AgencyAggregateStub.getConsultantRole.returns(consultantRole);
      const agencyClientAggregate = new AgencyClientAggregate(aggregateId, aggregate, agencyRepositoryStub);

      const error = await agencyClientAggregate
        .validateAddClientConsultant(consultant)
        .should.be.rejectedWith(ValidationError, 'Consultant already assigned');

      error.assertEqual(
        new ValidationError('Consultant already assigned').setErrors([
          {
            code: 'CONSULTANT_ALREADY_ASSIGNED_ROLE',
            message: `Consultant ${consultant.consultant_id} already assigned to role ${consultant.consultant_role_id}`,
            path: ['consultant_id']
          }
        ])
      );
      agencyRepositoryStub.getAggregate.should.have.been.calledOnceWith(agencyAggregateId);
      AgencyAggregateStub.getConsultantRole.should.have.been.calledOnceWith(roleId);
    });

    it('should return validation error when consultant role is disabled', async () => {
      const aggregate = {
        last_sequence_id: 1,
        linked: true,
        client_type: 'site',
        consultants: [consultant]
      };
      const consultantRole = {
        _id: '2020',
        name: 'ooh',
        description: 'blah',
        max_consultants: 5,
        status: AgencyConsultantRoleEnum.AGENCY_CONSULTANT_ROLE_STATUS_DISABLED
      };

      const AgencyAggregateStub = stubConstructor(AgencyAggregate);
      const agencyRepositoryStub = stubConstructor(AgencyRepository);

      agencyRepositoryStub.getAggregate.resolves(AgencyAggregateStub);
      AgencyAggregateStub.getConsultantRole.returns(consultantRole);
      const agencyClientAggregate = new AgencyClientAggregate(aggregateId, aggregate, agencyRepositoryStub);

      const error = await agencyClientAggregate
        .validateAddClientConsultant(consultant)
        .should.be.rejectedWith(ValidationError, 'Consultant role not enabled');

      error.assertEqual(
        new ValidationError('Consultant role not enabled').setErrors([
          {
            code: 'CONSULTANT_ROLE_NOT_ENABLED',
            message: `Consultant role ${consultant.consultant_role_id} is not enabled`,
            path: ['consultant_role_id']
          }
        ])
      );
      agencyRepositoryStub.getAggregate.should.have.been.calledOnceWith(agencyAggregateId);
      AgencyAggregateStub.getConsultantRole.should.have.been.calledOnceWith(roleId);
    });

    it('should return validation error when client is not linked to agency', async function () {
      const aggregate = {
        last_sequence_id: 1,
        client_type: 'site',
        consultants: [consultant]
      };
      const consultantRole = {
        _id: 'other_role',
        name: 'ooh',
        description: 'blah',
        max_consultants: 1,
        status: AgencyConsultantRoleEnum.AGENCY_CONSULTANT_ROLE_STATUS_ENABLED
      };
      const assignConsultant = {
        consultant_role_id: 'other_role',
        _id: '1010',
        consultant_id: '3030',
        client_type: 'site',
        site_id: '12345'
      };

      const AgencyAggregateStub = stubConstructor(AgencyAggregate);
      const agencyRepositoryStub = stubConstructor(AgencyRepository);

      agencyRepositoryStub.getAggregate.resolves(AgencyAggregateStub);
      AgencyAggregateStub.getConsultantRole.returns(consultantRole);
      const agencyClientAggregate = new AgencyClientAggregate(aggregateId, aggregate, agencyRepositoryStub);

      await agencyClientAggregate
        .validateAddClientConsultant(assignConsultant)
        .should.be.rejectedWith(ResourceNotFoundError, 'Agency client not found');
      agencyRepositoryStub.getAggregate.should.have.been.calledOnceWith(agencyAggregateId);
      AgencyAggregateStub.getConsultantRole.should.have.been.calledOnceWith('other_role');
    });
  });

  describe('validateRemoveClientConsultant()', () => {
    it('should throw resource not found error when the consultant to be removed is not found', async () => {
      const aggregateId = {
        agency_id: '45',
        client_id: '12'
      };
      const consultant = {
        _id: '1010',
        consultant_role_id: '2020',
        consultant_id: '3030',
        client_type: 'site',
        site_id: '12345'
      };
      const aggregate = {
        last_sequence_id: 1,
        linked: true,
        client_type: 'site',
        consultants: [] as AgencyClientConsultantInterface[]
      };
      const agencyRepositoryStub = stubConstructor(AgencyRepository);
      const agencyClientAggregate = new AgencyClientAggregate(aggregateId, aggregate, agencyRepositoryStub);

      await agencyClientAggregate
        .validateRemoveClientConsultant(consultant)
        .should.be.rejectedWith(ResourceNotFoundError, 'Consultant that was supposed to be removed does not exist');
    });

    it('should resolve successfully when the consultant to be removed is found', async () => {
      const aggregateId = {
        agency_id: '45',
        client_id: '12'
      };
      const consultant = {
        _id: '1010',
        consultant_role_id: '2020',
        consultant_id: '3030',
        client_type: 'site',
        site_id: '12345'
      };
      const aggregate = {
        last_sequence_id: 1,
        linked: true,
        client_type: 'site',
        consultants: [consultant]
      };
      const agencyRepositoryStub = stubConstructor(AgencyRepository);
      const agencyClientAggregate = new AgencyClientAggregate(aggregateId, aggregate, agencyRepositoryStub);

      await agencyClientAggregate.validateRemoveClientConsultant(consultant);
    });
  });

  describe('getConsultants()', () => {
    it('should return all consultants', () => {
      const aggregateId = {
        agency_id: '45',
        client_id: '12'
      };
      const consultant = {
        _id: '1010',
        consultant_role_id: '2020',
        consultant_id: '3030',
        client_type: 'site',
        site_id: '12345'
      };
      const aggregate = {
        last_sequence_id: 1,
        linked: true,
        client_type: 'site',
        consultants: [consultant]
      };
      const agencyRepositoryStub = stubConstructor(AgencyRepository);
      const agencyClientAggregate = new AgencyClientAggregate(aggregateId, aggregate, agencyRepositoryStub);
      const results = agencyClientAggregate.getConsultants();

      assert.deepEqual(results, [consultant], 'Incorrect list of consultants returned');
    });
  });

  describe('validateTransferClientConsultant', () => {
    const agencyId = '333';
    const aggregateId = {
      agency_id: agencyId,
      client_id: '12'
    };

    const consultant = {
      _id: 'from id',
      consultant_role_id: 'consultant role id',
      consultant_id: '3030',
      client_type: 'site',
      site_id: '12345'
    };
    const commandData: TransferAgencyClientConsultantCommandDataInterface = {
      from_id: 'from id',
      to_id: 'to id',
      to_consultant_id: 'consultant id',
      to_consultant_role_id: 'consultant role id'
    };

    it('should return resource not found when agency client not found', async () => {
      const aggregate = {
        last_sequence_id: 1,
        client_type: 'site'
      };
      const agencyRepositoryStub = stubConstructor(AgencyRepository);
      const agencyClientAggregate = new AgencyClientAggregate(aggregateId, aggregate, agencyRepositoryStub);

      await agencyClientAggregate
        .validateTransferClientConsultant(commandData)
        .should.be.rejectedWith(ResourceNotFoundError, 'Agency client not found');
    });

    it('should return resource not found when client consultant not found', async () => {
      const aggregate = {
        last_sequence_id: 1,
        linked: true,
        client_type: 'site'
      };
      const agencyRepositoryStub = stubConstructor(AgencyRepository);
      const agencyClientAggregate = new AgencyClientAggregate(aggregateId, aggregate, agencyRepositoryStub);

      await agencyClientAggregate
        .validateTransferClientConsultant(commandData)
        .should.be.rejectedWith(ResourceNotFoundError, 'Consultant that was supposed to be removed does not exist');
    });
    it('should return ValidationError when consultant role not found', async () => {
      const aggregate = {
        last_sequence_id: 1,
        linked: true,
        client_type: 'site',
        consultants: [consultant]
      };
      const agencyRepositoryStub = stubConstructor(AgencyRepository);
      const agencyClientAggregate = new AgencyClientAggregate(aggregateId, aggregate, agencyRepositoryStub);
      const agencyAggregate = stubInterface<AgencyAggregate>();

      agencyRepositoryStub.getAggregate.resolves(agencyAggregate);
      agencyAggregate.getConsultantRole.returns(null);

      try {
        await agencyClientAggregate.validateTransferClientConsultant(commandData);
        assert.fail('It should not happen');
      } catch (error) {
        error.assertEqual(
          new ValidationError('Consultant role not found').setErrors([
            {
              code: 'CONSULTANT_ROLE_NOT_FOUND',
              message: `Consultant role ${commandData.to_consultant_role_id} does not not exist`,
              path: ['to_consultant_role_id']
            }
          ])
        );
      }
      agencyRepositoryStub.getAggregate.should.have.been.calledOnceWith({agency_id: agencyId});
      agencyAggregate.getConsultantRole.should.have.been.calledWith(commandData.to_consultant_role_id);
    });

    it('should success scenario', async () => {
      const aggregate = {
        last_sequence_id: 1,
        linked: true,
        client_type: 'site',
        consultants: [
          {
            _id: 'from id',
            consultant_role_id: 'some id',
            consultant_id: 'another id',
            client_type: 'site',
            site_id: '12345'
          }
        ]
      };
      const agencyRepositoryStub = stubConstructor(AgencyRepository);
      const agencyClientAggregate = new AgencyClientAggregate(aggregateId, aggregate, agencyRepositoryStub);
      const agencyAggregate = stubInterface<AgencyAggregate>();

      agencyRepositoryStub.getAggregate.resolves(agencyAggregate);
      agencyAggregate.getConsultantRole.returns({} as any);

      await agencyClientAggregate.validateTransferClientConsultant(commandData);
      agencyRepositoryStub.getAggregate.should.have.been.calledOnceWith({agency_id: agencyId});
      agencyAggregate.getConsultantRole.should.have.been.calledWith(commandData.to_consultant_role_id);
    });
  });

  describe('isConsultantAlreadyAssigned()', () => {
    const consultantRoleId = 'consultant role id';
    const consultantId = 'consultant id';
    const agencyId = '333';
    const aggregateId = {
      agency_id: agencyId,
      client_id: '12'
    };

    it('should return true when client is already assign to consultant with that role', async () => {
      const aggregate = {
        last_sequence_id: 1,
        linked: true,
        client_type: 'site',
        consultants: [
          {
            _id: 'from id',
            consultant_role_id: consultantRoleId,
            consultant_id: consultantId,
            client_type: 'site',
            site_id: '12345'
          }
        ]
      };
      const agencyRepositoryStub = stubConstructor(AgencyRepository);
      const agencyClientAggregate = new AgencyClientAggregate(aggregateId, aggregate, agencyRepositoryStub);

      agencyClientAggregate.isConsultantAlreadyAssigned(consultantId, consultantRoleId).should.be.true;
    });
    it('should return false when client is not already assign to consultant with that role', async () => {
      const aggregate = {
        last_sequence_id: 1,
        linked: true,
        client_type: 'site',
        consultants: [
          {
            _id: 'from id',
            consultant_role_id: consultantRoleId,
            consultant_id: consultantId,
            client_type: 'site',
            site_id: '12345'
          }
        ]
      };
      const agencyRepositoryStub = stubConstructor(AgencyRepository);
      const agencyClientAggregate = new AgencyClientAggregate(aggregateId, aggregate, agencyRepositoryStub);

      agencyClientAggregate.isConsultantAlreadyAssigned(consultantId, 'some other role').should.be.false;
    });
  });

  describe('getId()', () => {
    it('should return aggregate id', () => {
      const aggregateId = {
        agency_id: '45',
        client_id: '12'
      };
      const consultant = {
        _id: '1010',
        consultant_role_id: '2020',
        consultant_id: '3030',
        client_type: 'site',
        site_id: '12345'
      };
      const aggregate = {
        last_sequence_id: 1,
        linked: true,
        client_type: 'site',
        consultants: [consultant]
      };
      const agencyRepositoryStub = stubConstructor(AgencyRepository);
      const agencyClientAggregate = new AgencyClientAggregate(aggregateId, aggregate, agencyRepositoryStub);
      const id = agencyClientAggregate.getId();

      assert.deepEqual(id, aggregateId, 'Incorrect aggregateId returned');
    });
  });

  describe('getLastSequenceId()', () => {
    it('should return aggregate last event id', () => {
      const aggregateId = {
        agency_id: '45',
        client_id: '12'
      };
      const consultant = {
        _id: '1010',
        consultant_role_id: '2020',
        consultant_id: '3030',
        client_type: 'site',
        site_id: '12345'
      };
      const aggregate = {
        last_sequence_id: 1,
        linked: true,
        client_type: 'site',
        consultants: [consultant]
      };
      const agencyRepositoryStub = stubConstructor(AgencyRepository);
      const agencyClientAggregate = new AgencyClientAggregate(aggregateId, aggregate, agencyRepositoryStub);
      const id = agencyClientAggregate.getLastSequenceId();

      assert.equal(id, aggregate.last_sequence_id, 'Incorrect aggregate last_sequence_id returned');
    });
  });

  describe('toJSON()', () => {
    it('should return the aggregate', () => {
      const aggregateId = {
        agency_id: '45',
        client_id: '12'
      };
      const consultant = {
        _id: '1010',
        consultant_role_id: '2020',
        consultant_id: '3030',
        client_type: 'site',
        site_id: '12345'
      };
      const aggregate = {
        last_sequence_id: 1,
        linked: true,
        client_type: 'site',
        consultants: [consultant]
      };
      const agencyRepositoryStub = stubConstructor(AgencyRepository);
      const agencyClientAggregate = new AgencyClientAggregate(aggregateId, aggregate, agencyRepositoryStub);
      const aggregateObj = agencyClientAggregate.toJSON();

      assert.deepEqual(aggregateObj, aggregate, 'Incorrect aggregate returned');
    });
  });

  describe('getClientType()', () => {
    it('should return the type', () => {
      const aggregateId = {
        agency_id: '45',
        client_id: '12'
      };
      const aggregate = {
        last_sequence_id: 1,
        linked: true,
        client_type: 'site'
      };
      const agencyRepositoryStub = stubConstructor(AgencyRepository);
      const agencyClientAggregate = new AgencyClientAggregate(aggregateId, aggregate, agencyRepositoryStub);

      agencyClientAggregate.getClientType().should.equal('site');
    });
  });

  describe('getParentClientId()', () => {
    it('should return parent client id', () => {
      const aggregateId = {
        agency_id: '45',
        client_id: '12'
      };
      const aggregate = {
        last_sequence_id: 1,
        linked: true,
        client_type: 'site',
        parent_id: 'parent id'
      };
      const agencyRepositoryStub = stubConstructor(AgencyRepository);
      const agencyClientAggregate = new AgencyClientAggregate(aggregateId, aggregate, agencyRepositoryStub);

      agencyClientAggregate.getParentClientId().should.equal('parent id');
    });

    it('should return null when node does not have parent', () => {
      const aggregateId = {
        agency_id: '45',
        client_id: '12'
      };
      const aggregate = {
        last_sequence_id: 1,
        linked: true,
        client_type: 'site'
      };
      const agencyRepositoryStub = stubConstructor(AgencyRepository);
      const agencyClientAggregate = new AgencyClientAggregate(aggregateId, aggregate, agencyRepositoryStub);

      (agencyClientAggregate.getParentClientId() === null).should.be.true;
    });
  });

  describe('getLinkedDate()', () => {
    it('should return linked date', () => {
      const aggregateId = {
        agency_id: '45',
        client_id: '12'
      };
      const date = new Date();
      const aggregate = {
        last_sequence_id: 1,
        linked: true,
        client_type: 'site',
        linked_date: date
      };
      const agencyRepositoryStub = stubConstructor(AgencyRepository);
      const agencyClientAggregate = new AgencyClientAggregate(aggregateId, aggregate, agencyRepositoryStub);

      agencyClientAggregate.getLinkedDate().should.equal(date);
    });

    it('should return null when not linked', () => {
      const aggregateId = {
        agency_id: '45',
        client_id: '12'
      };
      const aggregate = {
        last_sequence_id: 1,
        linked: false,
        client_type: 'site'
      };
      const agencyRepositoryStub = stubConstructor(AgencyRepository);
      const agencyClientAggregate = new AgencyClientAggregate(aggregateId, aggregate, agencyRepositoryStub);

      (agencyClientAggregate.getLinkedDate() === null).should.be.true;
    });
  });
});
