import {assert} from 'chai';
import sinon from 'sinon';
import {stubConstructor} from 'ts-sinon';
import {AgencyAggregate} from '../../../src/Agency/AgencyAggregate';
import {AgencyRepository} from '../../../src/Agency/AgencyRepository';
import {UpdateAgencyConsultantRoleCommandHandler} from '../../../src/Agency/command-handlers/UpdateAgencyConsultantRoleCommandHandler';
import {AgencyCommandEnum, AgencyEventEnum} from '../../../src/Agency/types';
import {UpdateAgencyConsultantRoleCommandDataInterface} from '../../../src/Agency/types/CommandDataTypes';

describe('UpdateAgencyConsultantRoleCommandHandler', () => {
  afterEach(() => {
    sinon.restore();
  });
  describe('execute()', () => {
    it('Test correct events are persisted', async () => {
      const agencyId = 'agency id';
      const roleId = 'some-id';
      const commandData = {
        _id: roleId,
        name: 'some name',
        description: 'description',
        max_consultants: 2
      } as UpdateAgencyConsultantRoleCommandDataInterface;
      const agencyRepository = stubConstructor(AgencyRepository);
      const aggregate = stubConstructor(AgencyAggregate);

      agencyRepository.save.resolves();
      agencyRepository.getAggregate.resolves(aggregate);
      aggregate.getLastEventId.returns(100);
      aggregate.getId.returns({agency_id: agencyId});
      aggregate.validateUpdateConsultantRole.returns();
      const handler = new UpdateAgencyConsultantRoleCommandHandler(agencyRepository);

      assert.equal(
        handler.commandType,
        AgencyCommandEnum.UPDATE_AGENCY_CONSULTANT_ROLE,
        'Expected command type to match'
      );
      await handler.execute(agencyId, commandData);

      agencyRepository.save.should.have.been.calledWith([
        {
          type: AgencyEventEnum.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED,
          aggregate_id: {agency_id: agencyId},
          data: commandData,
          sequence_id: 101
        }
      ]);
      agencyRepository.getAggregate.should.have.been.calledOnceWith(agencyId);
      aggregate.validateUpdateConsultantRole.should.have.calledOnceWith(roleId);
    });

    it('Test exception is thrown for validate consultant role', async () => {
      const agencyId = 'agency id';
      const roleId = 'some-id';
      const commandData = {
        _id: roleId,
        name: 'some name',
        description: 'description',
        max_consultants: 2
      } as UpdateAgencyConsultantRoleCommandDataInterface;
      const agencyRepository = stubConstructor(AgencyRepository);
      const aggregate = stubConstructor(AgencyAggregate);
      const error = new Error('sample error');

      agencyRepository.getAggregate.resolves(aggregate);
      aggregate.validateUpdateConsultantRole.throws(error);
      const handler = new UpdateAgencyConsultantRoleCommandHandler(agencyRepository);

      await handler.execute(agencyId, commandData).should.be.rejectedWith(error);

      aggregate.validateUpdateConsultantRole.should.have.been.calledOnce;
      agencyRepository.save.should.not.have.been.called;
    });
  });
});
