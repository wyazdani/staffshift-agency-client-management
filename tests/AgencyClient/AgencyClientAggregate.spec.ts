import {assert} from 'chai';
import {AgencyClientAggregate} from '../../src/AgencyClient/AgencyClientAggregate';
import sinon, {stubObject, stubConstructor} from 'ts-sinon';
import {AgencyRepository} from '../../src/Agency/AgencyRepository';
import {AgencyAggregate} from '../../src/Agency/AgencyAggregate';
import {ValidationError} from 'a24-node-error-utils';
import {AgencyConsultantRoleEnum} from '../../src/Agency/types';
import {AgencyClientConsultantInterface} from '../../src/AgencyClient/types';

describe('AgencyClientAggregate', () => {
  let agencyRepository: AgencyRepository;

  beforeEach(() => {
    agencyRepository = stubConstructor(AgencyRepository);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('validateAddClientConsultant()', () => {
    const agencyId = '333';
    const roleId = '2020';
    const aggregateId = {
      agency_id: agencyId,
      client_id: '12'
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
      const agencyRepositoryStub = stubObject<AgencyRepository>(agencyRepository);

      agencyRepositoryStub.getAggregate.resolves(AgencyAggregateStub);
      AgencyAggregateStub.getConsultantRole.returns(undefined);
      const agencyClientAggregate = new AgencyClientAggregate(aggregateId, aggregate, agencyRepositoryStub);

      await agencyClientAggregate
        .validateAddClientConsultant(consultant)
        .should.be.rejectedWith(ValidationError, 'Consultant role 2020 does not not exist');
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
      const agencyRepositoryStub = stubObject<AgencyRepository>(agencyRepository);

      agencyRepositoryStub.getAggregate.resolves(AgencyAggregateStub);
      AgencyAggregateStub.getConsultantRole.returns(consultantRole);
      const agencyClientAggregate = new AgencyClientAggregate(aggregateId, aggregate, agencyRepositoryStub);

      await agencyClientAggregate
        .validateAddClientConsultant(consultant)
        .should.be.rejectedWith(ValidationError, 'Too many consultants for the role 2020');
      assert.equal(
        agencyRepositoryStub.getAggregate.getCall(0).args[0],
        agencyId,
        'getAggregate called with incorrect args'
      );
      assert.equal(
        AgencyAggregateStub.getConsultantRole.getCall(0).args[0],
        roleId,
        'getConsultantRole called with incorrect args'
      );
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
      const agencyRepositoryStub = stubObject<AgencyRepository>(agencyRepository);

      agencyRepositoryStub.getAggregate.resolves(AgencyAggregateStub);
      AgencyAggregateStub.getConsultantRole.returns(consultantRole);
      const agencyClientAggregate = new AgencyClientAggregate(aggregateId, aggregate, agencyRepositoryStub);

      await agencyClientAggregate
        .validateAddClientConsultant(consultant)
        .should.be.rejectedWith(ValidationError, 'Consultant role 2020 is not enabled');
      assert.equal(
        agencyRepositoryStub.getAggregate.getCall(0).args[0],
        agencyId,
        'getAggregate called with incorrect args'
      );
      assert.equal(
        AgencyAggregateStub.getConsultantRole.getCall(0).args[0],
        roleId,
        'getConsultantRole called with incorrect args'
      );
    });
  });

  describe('validateRemoveClientConsultant()', () => {
    it('should throw validation error when the consultant to be removed is not found', async () => {
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
      const agencyRepositoryStub = stubObject<AgencyRepository>(agencyRepository);
      const agencyClientAggregate = new AgencyClientAggregate(aggregateId, aggregate, agencyRepositoryStub);

      await agencyClientAggregate
        .validateRemoveClientConsultant(consultant)
        .should.be.rejectedWith(ValidationError, 'Consultant that was supposed to be removed does not exist');
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
      const agencyRepositoryStub = stubObject<AgencyRepository>(agencyRepository);
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
      const agencyRepositoryStub = stubObject<AgencyRepository>(agencyRepository);
      const agencyClientAggregate = new AgencyClientAggregate(aggregateId, aggregate, agencyRepositoryStub);
      const results = agencyClientAggregate.getConsultants();

      assert.deepEqual(results, [consultant], 'Incorrect list of consultants returned');
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
      const agencyRepositoryStub = stubObject<AgencyRepository>(agencyRepository);
      const agencyClientAggregate = new AgencyClientAggregate(aggregateId, aggregate, agencyRepositoryStub);
      const id = agencyClientAggregate.getId();

      assert.deepEqual(id, aggregateId, 'Incorrect aggregateId returned');
    });
  });

  describe('getLastEventId()', () => {
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
      const agencyRepositoryStub = stubObject<AgencyRepository>(agencyRepository);
      const agencyClientAggregate = new AgencyClientAggregate(aggregateId, aggregate, agencyRepositoryStub);
      const id = agencyClientAggregate.getLastEventId();

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
      const agencyRepositoryStub = stubObject<AgencyRepository>(agencyRepository);
      const agencyClientAggregate = new AgencyClientAggregate(aggregateId, aggregate, agencyRepositoryStub);
      const aggregateObj = agencyClientAggregate.toJSON();

      assert.deepEqual(aggregateObj, aggregate, 'Incorrect aggregate returned');
    });
  });
});
