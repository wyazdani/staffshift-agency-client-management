import {assert} from 'chai';
import sinon from 'sinon';
import {stubConstructor} from 'ts-sinon';
import {AgencyAggregate} from '../../../../src/aggregates/Agency/AgencyAggregate';
import {AgencyRepository} from '../../../../src/aggregates/Agency/AgencyRepository';
import {DisableAgencyConsultantRoleCommandHandler} from '../../../../src/aggregates/Agency/command-handlers/DisableAgencyConsultantRoleCommandHandler';
import {AgencyCommandEnum} from '../../../../src/aggregates/Agency/types';
import {DisableAgencyConsultantRoleCommandInterface} from '../../../../src/aggregates/Agency/types/CommandTypes';
import {EventsEnum} from '../../../../src/Events';

describe('DisableAgencyConsultantRoleCommandHandler', () => {
  afterEach(() => {
    sinon.restore();
  });
  describe('execute()', () => {
    const agencyId = 'agency id';
    const roleId = 'some-id';
    const command: DisableAgencyConsultantRoleCommandInterface = {
      aggregateId: {
        agency_id: agencyId
      },
      type: AgencyCommandEnum.DISABLE_AGENCY_CONSULTANT_ROLE,
      data: {
        _id: roleId
      }
    };

    it('Test correct events are persisted', async () => {
      const agencyRepository = stubConstructor(AgencyRepository);
      const aggregate = stubConstructor(AgencyAggregate);

      agencyRepository.save.resolves();
      agencyRepository.getAggregate.resolves(aggregate);
      aggregate.getLastSequenceId.returns(100);
      aggregate.getId.returns({agency_id: agencyId});
      aggregate.canDisableConsultantRole.returns(true);
      const handler = new DisableAgencyConsultantRoleCommandHandler(agencyRepository);

      assert.equal(
        handler.commandType,
        AgencyCommandEnum.DISABLE_AGENCY_CONSULTANT_ROLE,
        'Expected command type to match'
      );
      await handler.execute(command);

      agencyRepository.save.should.have.been.calledOnceWith([
        {
          type: EventsEnum.AGENCY_CONSULTANT_ROLE_DISABLED,
          aggregate_id: {agency_id: agencyId},
          data: command.data,
          sequence_id: 101
        }
      ]);
      agencyRepository.getAggregate.should.have.been.calledOnceWith(command.aggregateId);
      aggregate.canDisableConsultantRole.should.have.calledOnceWith(roleId);
    });

    it('Test exception is thrown for validate consultant role', async () => {
      const agencyRepository = stubConstructor(AgencyRepository);
      const aggregate = stubConstructor(AgencyAggregate);
      const error = new Error('sample error');

      agencyRepository.getAggregate.resolves(aggregate);
      aggregate.canDisableConsultantRole.throws(error);
      const handler = new DisableAgencyConsultantRoleCommandHandler(agencyRepository);

      await handler.execute(command).should.be.rejectedWith(Error, 'sample error');

      aggregate.canDisableConsultantRole.should.have.been.calledOnce;
      agencyRepository.save.should.not.have.been.called;
    });

    it('should resolve successfully when role cannot be disabled', async () => {
      const agencyRepository = stubConstructor(AgencyRepository);
      const aggregate = stubConstructor(AgencyAggregate);

      agencyRepository.getAggregate.resolves(aggregate);
      aggregate.getLastSequenceId.returns(100);
      aggregate.canDisableConsultantRole.returns(false);
      const handler = new DisableAgencyConsultantRoleCommandHandler(agencyRepository);

      assert.equal(
        handler.commandType,
        AgencyCommandEnum.DISABLE_AGENCY_CONSULTANT_ROLE,
        'Expected command type to match'
      );
      await handler.execute(command);

      assert.isFalse(agencyRepository.save.called, 'Save must not be called');
      agencyRepository.getAggregate.should.have.been.calledOnceWith(command.aggregateId);
      aggregate.canDisableConsultantRole.should.have.calledOnceWith(roleId);
    });
  });
});
