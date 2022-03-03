import {stubInterface} from 'ts-sinon';
import {AgencyAggregate} from '../../../src/aggregates/Agency/AgencyAggregate';
import {AgencyRepository} from '../../../src/aggregates/Agency/AgencyRepository';
import {ConsultantJobAggregate} from '../../../src/aggregates/ConsultantJob/ConsultantJobAggregate';
import {AssignConsultantCommandDataInterface} from '../../../src/aggregates/ConsultantJob/types/CommandDataTypes';
import {ValidationError} from 'a24-node-error-utils';

describe('ConsultantJobAggregate', () => {
  const aggregateId = {
    name: 'consultant',
    agency_id: 'agency id'
  };

  describe('validateAssignConsultant', () => {
    const consultantId = 'consultant id';
    const consultantRoleId = 'consultant role id';
    const command: AssignConsultantCommandDataInterface = {
      _id: 'id',
      client_ids: ['client id'],
      consultant_id: consultantId,
      consultant_role_id: consultantRoleId
    };

    it('Test consultant role not found', async () => {
      const aggregate = {
        last_sequence_id: 1
      };
      const agencyRepository = stubInterface<AgencyRepository>();
      const agencyAggregate = stubInterface<AgencyAggregate>();

      agencyRepository.getAggregate.resolves(agencyAggregate);
      agencyAggregate.getConsultantRole.returns(undefined);
      const consultantJobAggregate = new ConsultantJobAggregate(aggregateId, aggregate, agencyRepository);

      const error = await consultantJobAggregate
        .validateAssignConsultant(command)
        .should.be.rejectedWith(ValidationError);

      error.should.deep.equal(
        new ValidationError('Not allowed consultant role', [
          {
            code: 'CONSULTANT_ROLE_NOT_FOUND',
            message: `Consultant role ${command.consultant_role_id} does not not exist`,
            path: ['consultant_role_id']
          }
        ])
      );
    });

    it('Test consultant role not enabled', async () => {
      const aggregate = {
        last_sequence_id: 1
      };
      const role: any = {status: 'disabled'};
      const agencyRepository = stubInterface<AgencyRepository>();
      const agencyAggregate = stubInterface<AgencyAggregate>();

      agencyRepository.getAggregate.resolves(agencyAggregate);
      agencyAggregate.getConsultantRole.returns(role);
      const consultantJobAggregate = new ConsultantJobAggregate(aggregateId, aggregate, agencyRepository);

      const error = await consultantJobAggregate
        .validateAssignConsultant(command)
        .should.be.rejectedWith(ValidationError);

      error.should.deep.equal(
        new ValidationError('Not allowed consultant role', [
          {
            code: 'CONSULTANT_ROLE_NOT_ENABLED',
            message: `Consultant role ${command.consultant_role_id} is not enabled`,
            path: ['consultant_role_id']
          }
        ])
      );
    });

    it('Test another consultant process active', async () => {
      const aggregate: any = {
        last_sequence_id: 1,
        processes: [
          {
            consultants: [consultantId],
            status: 'oops'
          }
        ]
      };
      const role: any = {status: 'enabled'};
      const agencyRepository = stubInterface<AgencyRepository>();
      const agencyAggregate = stubInterface<AgencyAggregate>();

      agencyRepository.getAggregate.resolves(agencyAggregate);
      agencyAggregate.getConsultantRole.returns(role);
      const consultantJobAggregate = new ConsultantJobAggregate(aggregateId, aggregate, agencyRepository);

      const error = await consultantJobAggregate
        .validateAssignConsultant(command)
        .should.be.rejectedWith(ValidationError);

      error.should.deep.equal(
        new ValidationError('Not allowed consultant', [
          {
            code: 'ANOTHER_CONSULTANT_PROCESS_ACTIVE',
            message: `There is another job still running for this consultant id ${command.consultant_id}`,
            path: ['consultant_id']
          }
        ])
      );
    });

    it('Test success when other processes are done', async () => {
      const aggregate: any = {
        last_sequence_id: 1,
        processes: [
          {
            consultants: [consultantId],
            status: 'completed'
          }
        ]
      };
      const role: any = {status: 'enabled'};
      const agencyRepository = stubInterface<AgencyRepository>();
      const agencyAggregate = stubInterface<AgencyAggregate>();

      agencyRepository.getAggregate.resolves(agencyAggregate);
      agencyAggregate.getConsultantRole.returns(role);
      const consultantJobAggregate = new ConsultantJobAggregate(aggregateId, aggregate, agencyRepository);

      await consultantJobAggregate.validateAssignConsultant(command);
    });

    it('Test success when there is no other process', async () => {
      const aggregate = {
        last_sequence_id: 1
      };
      const role: any = {status: 'enabled'};
      const agencyRepository = stubInterface<AgencyRepository>();
      const agencyAggregate = stubInterface<AgencyAggregate>();

      agencyRepository.getAggregate.resolves(agencyAggregate);
      agencyAggregate.getConsultantRole.returns(role);
      const consultantJobAggregate = new ConsultantJobAggregate(aggregateId, aggregate, agencyRepository);

      await consultantJobAggregate.validateAssignConsultant(command);
    });
  });
  describe('getId()', () => {
    it('should return aggregate id', () => {
      const aggregate = {
        last_sequence_id: 1
      };
      const agencyRepositoryStub = stubInterface<AgencyRepository>();
      const agencyClientAggregate = new ConsultantJobAggregate(aggregateId, aggregate, agencyRepositoryStub);
      const id = agencyClientAggregate.getId();

      id.should.equal(aggregateId);
    });
  });

  describe('getLastEventId()', () => {
    it('should return aggregate last event id', () => {
      const aggregate = {
        last_sequence_id: 1
      };
      const agencyRepositoryStub = stubInterface<AgencyRepository>();
      const consultantJobAggregate = new ConsultantJobAggregate(aggregateId, aggregate, agencyRepositoryStub);
      const id = consultantJobAggregate.getLastEventId();

      id.should.equal(1);
    });
  });

  describe('toJSON()', () => {
    it('should return the aggregate', () => {
      const aggregate = {
        last_sequence_id: 1
      };
      const agencyRepositoryStub = stubInterface<AgencyRepository>();
      const consultantJobAggregate = new ConsultantJobAggregate(aggregateId, aggregate, agencyRepositoryStub);
      const id = consultantJobAggregate.toJSON();

      id.should.equal(aggregate);
    });
  });
});
