import {assert} from 'chai';
import sinon from 'sinon';
import {stubConstructor} from 'ts-sinon';
import {AgencyAggregate} from '../../../../src/aggregates/Agency/AgencyAggregate';
import {AgencyRepository} from '../../../../src/aggregates/Agency/AgencyRepository';
import {UpdateAgencyConsultantRoleCommandHandler} from '../../../../src/aggregates/Agency/command-handlers/UpdateAgencyConsultantRoleCommandHandler';
import {AgencyCommandEnum} from '../../../../src/aggregates/Agency/types';
import {UpdateAgencyConsultantRoleCommandInterface} from '../../../../src/aggregates/Agency/types/CommandTypes';
import {EventsEnum} from '../../../../src/Events';

describe('UpdateAgencyConsultantRoleCommandHandler', () => {
  afterEach(() => {
    sinon.restore();
  });
  describe('execute()', () => {
    const agencyId = 'agency id';
    const roleId = 'some-id';
    const command: UpdateAgencyConsultantRoleCommandInterface = {
      aggregateId: {
        name: 'agency',
        agency_id: agencyId
      },
      type: AgencyCommandEnum.UPDATE_AGENCY_CONSULTANT_ROLE,
      data: {
        _id: roleId,
        name: 'some name',
        description: 'description',
        max_consultants: 2
      }
    };

    it('Test correct events are persisted', async () => {
      const agencyRepository = stubConstructor(AgencyRepository);
      const aggregate = stubConstructor(AgencyAggregate);

      agencyRepository.save.resolves();
      agencyRepository.getAggregate.resolves(aggregate);
      aggregate.getLastSequenceId.returns(100);
      aggregate.getId.returns({name: 'agency', agency_id: agencyId});
      aggregate.validateUpdateConsultantRole.returns();
      const handler = new UpdateAgencyConsultantRoleCommandHandler(agencyRepository);

      assert.equal(
        handler.commandType,
        AgencyCommandEnum.UPDATE_AGENCY_CONSULTANT_ROLE,
        'Expected command type to match'
      );
      await handler.execute(command);
      agencyRepository.save.should.have.been.calledOnceWith([
        {
          type: EventsEnum.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED,
          aggregate_id: {name: 'agency', agency_id: agencyId},
          data: command.data,
          sequence_id: 101
        }
      ]);
      agencyRepository.getAggregate.should.have.been.calledOnceWith(command.aggregateId);
      aggregate.validateUpdateConsultantRole.should.have.calledOnceWith(roleId);
    });

    it('Test exception is thrown for validate consultant role', async () => {
      const agencyRepository = stubConstructor(AgencyRepository);
      const aggregate = stubConstructor(AgencyAggregate);
      const error = new Error('sample error');

      agencyRepository.getAggregate.resolves(aggregate);
      aggregate.validateUpdateConsultantRole.throws(error);
      const handler = new UpdateAgencyConsultantRoleCommandHandler(agencyRepository);

      await handler.execute(command).should.be.rejectedWith(Error, 'sample error');

      aggregate.validateUpdateConsultantRole.should.have.been.calledOnce;
      agencyRepository.save.should.not.have.been.called;
    });
  });
});
