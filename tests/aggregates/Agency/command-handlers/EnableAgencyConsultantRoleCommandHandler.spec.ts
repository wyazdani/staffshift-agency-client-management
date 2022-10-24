import {assert} from 'chai';
import sinon from 'sinon';
import {stubConstructor} from 'ts-sinon';
import {AgencyAggregate} from '../../../../src/aggregates/Agency/AgencyAggregate';
import {AgencyRepository} from '../../../../src/aggregates/Agency/AgencyRepository';
import {EnableAgencyConsultantRoleCommandHandler} from '../../../../src/aggregates/Agency/command-handlers/EnableAgencyConsultantRoleCommandHandler';
import {AgencyCommandEnum} from '../../../../src/aggregates/Agency/types';
import {EnableAgencyConsultantRoleCommandDataInterface} from '../../../../src/aggregates/Agency/types/CommandDataTypes';
import {EnableAgencyConsultantRoleCommandInterface} from '../../../../src/aggregates/Agency/types/CommandTypes';
import {EventsEnum} from '../../../../src/Events';

describe('EnableAgencyConsultantRoleCommandHandler', () => {
  afterEach(() => {
    sinon.restore();
  });
  describe('execute()', () => {
    const agencyId = 'agency id';
    const roleId = 'some-id';
    const command: EnableAgencyConsultantRoleCommandInterface = {
      aggregateId: {
        name: 'agency',
        agency_id: agencyId
      },
      type: AgencyCommandEnum.ENABLE_AGENCY_CONSULTANT_ROLE,
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
      aggregate.getId.returns({name: 'agency', agency_id: agencyId});
      aggregate.canEnableConsultantRole.returns(true);
      const handler = new EnableAgencyConsultantRoleCommandHandler(agencyRepository);

      assert.equal(
        handler.commandType,
        AgencyCommandEnum.ENABLE_AGENCY_CONSULTANT_ROLE,
        'Expected command type to match'
      );
      await handler.execute(command);

      agencyRepository.save.should.have.been.calledOnceWith([
        {
          type: EventsEnum.AGENCY_CONSULTANT_ROLE_ENABLED,
          aggregate_id: {name: 'agency', agency_id: agencyId},
          data: command.data,
          sequence_id: 101
        }
      ]);

      agencyRepository.getAggregate.should.have.been.calledOnceWith(command.aggregateId);
      aggregate.canEnableConsultantRole.should.have.calledOnceWith(roleId);
    });

    it('Test exception is thrown for validate consultant role', async () => {
      const agencyRepository = stubConstructor(AgencyRepository);
      const aggregate = stubConstructor(AgencyAggregate);
      const error = new Error('sample error');

      agencyRepository.getAggregate.resolves(aggregate);
      aggregate.canEnableConsultantRole.throws(error);
      const handler = new EnableAgencyConsultantRoleCommandHandler(agencyRepository);

      await handler.execute(command).should.be.rejectedWith(Error, 'sample error');

      aggregate.canEnableConsultantRole.should.have.been.calledOnce;
      agencyRepository.save.should.not.have.been.called;
    });

    it('should resolve successfully when role cannot be enabled', async () => {
      const agencyRepository = stubConstructor(AgencyRepository);
      const aggregate = stubConstructor(AgencyAggregate);

      agencyRepository.getAggregate.resolves(aggregate);
      aggregate.getLastSequenceId.returns(100);
      aggregate.canEnableConsultantRole.returns(false);
      const handler = new EnableAgencyConsultantRoleCommandHandler(agencyRepository);

      assert.equal(
        handler.commandType,
        AgencyCommandEnum.ENABLE_AGENCY_CONSULTANT_ROLE,
        'Expected command type to match'
      );
      await handler.execute(command);

      assert.isFalse(agencyRepository.save.called, 'Save must not be called');
      agencyRepository.getAggregate.should.have.been.calledOnceWith(command.aggregateId);
      aggregate.canEnableConsultantRole.should.have.calledOnceWith(roleId);
    });
  });
});
