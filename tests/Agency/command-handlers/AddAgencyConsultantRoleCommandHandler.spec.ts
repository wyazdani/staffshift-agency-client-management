import {assert} from 'chai';
import sinon from 'sinon';
import {AgencyAggregate} from '../../../src/Agency/AgencyAggregate';
import {AgencyRepository} from '../../../src/Agency/AgencyRepository';
import {AddAgencyConsultantRoleCommandHandler} from '../../../src/Agency/command-handlers/AddAgencyConsultantRoleCommandHandler';
import {AgencyCommandEnum, AgencyEventEnum} from '../../../src/Agency/types';
import {AddAgencyConsultantRoleCommandDataInterface} from '../../../src/Agency/types/CommandDataTypes';
import {EventRepository} from '../../../src/EventRepository';
import {EventStore} from '../../../src/models/EventStore';

describe('AddAgencyConsultantRoleCommandHandler', () => {
  afterEach(() => {
    sinon.restore();
  });
  describe('execute()', () => {
    it('Test correct events are persisted', async () => {
      const agencyId = 'agency id';
      const commandData = {
        id: 'some-id',
        name: 'some name',
        description: 'description',
        max_consultants: 2
      } as AddAgencyConsultantRoleCommandDataInterface;
      const eventRepository = new EventRepository(EventStore, 'sample');
      const agencyRepository = new AgencyRepository(eventRepository);
      const save = sinon.stub(agencyRepository, 'save');
      const handler = new AddAgencyConsultantRoleCommandHandler(agencyRepository);

      sinon.stub(AgencyAggregate.prototype, 'getLastEventId').returns(100);
      sinon.stub(AgencyAggregate.prototype, 'getId').returns({agency_id: agencyId});
      assert.equal(handler.commandType, AgencyCommandEnum.ADD_AGENCY_CONSULTANT_ROLE, 'Expected command type to match');
      await handler.execute(agencyId, commandData);

      assert.deepEqual(
        save.getCall(0).args[0],
        [
          {
            type: AgencyEventEnum.AGENCY_CONSULTANT_ROLE_ADDED,
            aggregate_id: {agency_id: agencyId},
            data: {
              _id: 'some-id',
              name: 'some name',
              description: 'description',
              max_consultants: 2
            },
            sequence_id: 101
          },
          {
            type: AgencyEventEnum.AGENCY_CONSULTANT_ROLE_ENABLED,
            aggregate_id: {agency_id: agencyId},
            data: {
              _id: 'some-id'
            },
            sequence_id: 102
          }
        ],
        'Expected events to be saved'
      );
    });
  });
});
