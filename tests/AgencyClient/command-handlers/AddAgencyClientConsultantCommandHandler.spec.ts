import {assert} from 'chai';
import sinon from 'sinon';
import {EventRepository} from '../../../src/EventRepository';
import {AddAgencyClientConsultantCommandDataInterface} from '../../../src/AgencyClient/types/CommandDataTypes';
import {AgencyClientRepository} from '../../../src/AgencyClient/AgencyClientRepository';
import {AddAgencyClientConsultantCommandHandler} from '../../../src/AgencyClient/command-handlers/AddAgencyClientConsultantCommandHandler';
import {AgencyClientCommandEnum, AgencyClientEventEnum} from '../../../src/AgencyClient/types';
import {AgencyClientAggregate} from '../../../src/AgencyClient/AgencyClientAggregate';
import {stubObject, stubConstructor} from 'ts-sinon';
import {AgencyRepository} from '../../../src/Agency/AgencyRepository';

describe('AddAgencyClientConsultantCommandHandler', () => {
  const agencyId = '6141d9cb9fb4b44d53469145';
  const clientId = '6141d9cb9fb4b44d53469146';
  const aggregateId = {
    agency_id: agencyId,
    client_id: clientId
  };
  const projection = {
    last_sequence_id: 1,
    linked: true,
    client_type: 'site'
  };
  let agencyClientRepository: AgencyClientRepository;
  let agencyClientAggregate: AgencyClientAggregate;

  beforeEach(() => {
    const eventRepository = stubConstructor(EventRepository);
    const agencyRepository = stubConstructor(AgencyRepository);

    agencyClientRepository = new AgencyClientRepository(eventRepository);
    agencyClientAggregate = new AgencyClientAggregate(aggregateId, projection, agencyRepository);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('execute()', () => {
    it('test that correct event is saved', async () => {
      const commandData = {
        _id: 'some id',
        consultant_role_id: 'role id',
        consultant_id: 'consultant id'
      } as AddAgencyClientConsultantCommandDataInterface;
      const expectedEvents = [
        {
          type: AgencyClientEventEnum.AGENCY_CLIENT_CONSULTANT_ASSIGNED,
          aggregate_id: aggregateId,
          data: commandData,
          sequence_id: 2
        }
      ];

      const agencyClientAggregateStub = stubObject<AgencyClientAggregate>(agencyClientAggregate);
      const agencyClientRepositoryStub = stubObject<AgencyClientRepository>(agencyClientRepository);

      agencyClientRepositoryStub.getAggregate.resolves(agencyClientAggregateStub);
      agencyClientAggregateStub.validateAddClientConsultant.resolves();
      agencyClientAggregateStub.getLastEventId.returns(1);
      agencyClientAggregateStub.getId.returns(aggregateId);

      const handler = new AddAgencyClientConsultantCommandHandler(agencyClientRepositoryStub);

      assert.equal(
        handler.commandType,
        AgencyClientCommandEnum.ADD_AGENCY_CLIENT_CONSULTANT,
        'Expected command type to match'
      );
      await handler.execute(agencyId, clientId, commandData);

      agencyClientRepositoryStub.save.getCall(0).args[0].should.be.deep.equal(expectedEvents);
    });
  });
});
