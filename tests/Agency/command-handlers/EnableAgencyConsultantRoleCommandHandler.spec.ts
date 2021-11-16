import {assert} from 'chai';
import sinon from 'sinon';
import {stubConstructor} from 'ts-sinon';
import {AgencyAggregate} from '../../../src/Agency/AgencyAggregate';
import {AgencyRepository} from '../../../src/Agency/AgencyRepository';
import {EnableAgencyConsultantRoleCommandHandler} from '../../../src/Agency/command-handlers/EnableAgencyConsultantRoleCommandHandler';
import {AgencyCommandEnum} from '../../../src/Agency/types';
import {EnableAgencyConsultantRoleCommandDataInterface} from '../../../src/Agency/types/CommandDataTypes';
import {EventsEnum} from '../../../src/Events';

describe('EnableAgencyConsultantRoleCommandHandler', () => {
  afterEach(() => {
    sinon.restore();
  });
  describe('execute()', () => {
    it('Test correct events are persisted', async () => {
      const agencyId = 'agency id';
      const roleId = 'some-id';
      const commandData = {
        _id: roleId
      } as EnableAgencyConsultantRoleCommandDataInterface;
      const agencyRepository = stubConstructor(AgencyRepository);
      const aggregate = stubConstructor(AgencyAggregate);

      agencyRepository.save.resolves();
      agencyRepository.getAggregate.resolves(aggregate);
      aggregate.getLastEventId.returns(100);
      aggregate.getId.returns({agency_id: agencyId});
      aggregate.canEnableConsultantRole.returns(true);
      const handler = new EnableAgencyConsultantRoleCommandHandler(agencyRepository);

      assert.equal(
        handler.commandType,
        AgencyCommandEnum.ENABLE_AGENCY_CONSULTANT_ROLE,
        'Expected command type to match'
      );
      await handler.execute(agencyId, commandData);

      agencyRepository.save.should.have.been.calledWith([
        {
          type: EventsEnum.AGENCY_CONSULTANT_ROLE_ENABLED,
          aggregate_id: {agency_id: agencyId},
          data: commandData,
          sequence_id: 101
        }
      ]);
      agencyRepository.getAggregate.should.have.been.calledOnceWith(agencyId);
      aggregate.canEnableConsultantRole.should.have.calledOnceWith(roleId);
    });

  });
});
