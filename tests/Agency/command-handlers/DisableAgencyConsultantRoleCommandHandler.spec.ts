import {assert} from 'chai';
import sinon from 'sinon';
import {stubConstructor} from 'ts-sinon';
import {AgencyAggregate} from '../../../src/Agency/AgencyAggregate';
import {AgencyRepository} from '../../../src/Agency/AgencyRepository';
import {DisableAgencyConsultantRoleCommandHandler} from '../../../src/Agency/command-handlers/DisableAgencyConsultantRoleCommandHandler';
import {AgencyCommandEnum} from '../../../src/Agency/types';
import {DisableAgencyConsultantRoleCommandDataInterface} from '../../../src/Agency/types/CommandDataTypes';
import {EventsEnum} from '../../../src/Events';

describe('DisableAgencyConsultantRoleCommandHandler', () => {
  afterEach(() => {
    sinon.restore();
  });
  describe('execute()', () => {
    it('Test correct events are persisted', async () => {
      const agencyId = 'agency id';
      const roleId = 'some-id';
      const commandData = {
        _id: roleId
      } as DisableAgencyConsultantRoleCommandDataInterface;
      const agencyRepository = stubConstructor(AgencyRepository);
      const aggregate = stubConstructor(AgencyAggregate);

      agencyRepository.save.resolves();
      agencyRepository.getAggregate.resolves(aggregate);
      aggregate.getLastEventId.returns(100);
      aggregate.getId.returns({agency_id: agencyId});
      aggregate.canDisableConsultantRole.returns(true);
      const handler = new DisableAgencyConsultantRoleCommandHandler(agencyRepository);

      assert.equal(
        handler.commandType,
        AgencyCommandEnum.DISABLE_AGENCY_CONSULTANT_ROLE,
        'Expected command type to match'
      );
      await handler.execute(agencyId, commandData);

      agencyRepository.save.should.have.been.calledWith([
        {
          type: EventsEnum.AGENCY_CONSULTANT_ROLE_DISABLED,
          aggregate_id: {agency_id: agencyId},
          data: commandData,
          sequence_id: 101
        }
      ]);

      agencyRepository.getAggregate.should.have.been.calledOnceWith(agencyId);
      aggregate.canDisableConsultantRole.should.have.calledOnceWith(roleId);
    });

    it('Test exception is thrown for validate consultant role', async () => {
      const agencyId = 'agency id';
      const roleId = 'some-id';
      const commandData = {
        _id: roleId,
        name: 'some name',
        description: 'description',
        max_consultants: 2
      } as DisableAgencyConsultantRoleCommandDataInterface;
      const agencyRepository = stubConstructor(AgencyRepository);
      const aggregate = stubConstructor(AgencyAggregate);
      const error = new Error('sample error');

      agencyRepository.getAggregate.resolves(aggregate);
      aggregate.canDisableConsultantRole.throws(error);
      const handler = new DisableAgencyConsultantRoleCommandHandler(agencyRepository);

      await handler.execute(agencyId, commandData).should.be.rejectedWith(Error, 'sample error');

      aggregate.canDisableConsultantRole.should.have.been.calledOnce;
      agencyRepository.save.should.not.have.been.called;
    });

    it('should resolve successfully when role cannot be disabled', async () => {
      const agencyId = 'agency id';
      const roleId = 'some-id';
      const commandData = {
        _id: roleId
      } as DisableAgencyConsultantRoleCommandDataInterface;
      const agencyRepository = stubConstructor(AgencyRepository);
      const aggregate = stubConstructor(AgencyAggregate);

      agencyRepository.getAggregate.resolves(aggregate);
      aggregate.getLastEventId.returns(100);
      aggregate.canDisableConsultantRole.returns(false);
      const handler = new DisableAgencyConsultantRoleCommandHandler(agencyRepository);

      assert.equal(
        handler.commandType,
        AgencyCommandEnum.DISABLE_AGENCY_CONSULTANT_ROLE,
        'Expected command type to match'
      );
      await handler.execute(agencyId, commandData);

      assert.isFalse(agencyRepository.save.called, 'Save must not be called');
      agencyRepository.getAggregate.should.have.been.calledOnceWith(agencyId);
      aggregate.canDisableConsultantRole.should.have.calledOnceWith(roleId);
    });
  });
});
