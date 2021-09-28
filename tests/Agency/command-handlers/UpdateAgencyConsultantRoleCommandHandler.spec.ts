import {assert} from 'chai';
import sinon from 'sinon';
import {AgencyAggregate} from '../../../src/Agency/AgencyAggregate';
import {AgencyRepository} from '../../../src/Agency/AgencyRepository';
import {UpdateAgencyConsultantRoleCommandHandler} from '../../../src/Agency/command-handlers/UpdateAgencyConsultantRoleCommandHandler';
import {AgencyCommandEnum, AgencyEventEnum} from '../../../src/Agency/types';
import {
  UpdateAgencyConsultantRoleCommandDataInterface
} from '../../../src/Agency/types/CommandDataTypes';
import {EventRepository} from '../../../src/EventRepository';
import {EventStore} from '../../../src/models/EventStore';

describe('UpdateAgencyConsultantRoleCommandHandler', () => {
  afterEach(() => {
    sinon.restore();
  });
  describe('execute()', () => {
    it('Test correct events are persisted', async () => {
      const agencyId = 'agency id';
      const commandData = {
        _id: 'some-id',
        name: 'some name',
        description: 'description',
        max_consultants: 2
      } as UpdateAgencyConsultantRoleCommandDataInterface;
      const eventRepository = new EventRepository(EventStore, 'sample');
      const agencyRepository = new AgencyRepository(eventRepository);
      const save = sinon.stub(agencyRepository, 'save');
      const getAggregate = sinon.stub(agencyRepository, 'getAggregate').returns(new AgencyAggregate({agency_id: agencyId}, {
        consultant_roles: [],
        last_sequence_id: 10
      }));
      const handler = new UpdateAgencyConsultantRoleCommandHandler(agencyRepository);

      sinon.stub(AgencyAggregate.prototype, 'getLastEventId').returns(100);
      sinon.stub(AgencyAggregate.prototype, 'getId').returns({agency_id: agencyId});
      assert.equal(
        handler.commandType,
        AgencyCommandEnum.UPDATE_AGENCY_CONSULTANT_ROLE,
        'Expected command type to match'
      );
      await handler.execute(agencyId, commandData);

      save.should.have.been.calledWith([
        {
          type: AgencyEventEnum.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED,
          aggregate_id: {agency_id: agencyId},
          data: commandData,
          sequence_id: 101
        }
      ]);
    });
  });
});
