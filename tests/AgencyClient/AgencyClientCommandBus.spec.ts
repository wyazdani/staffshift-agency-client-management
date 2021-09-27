import sinon from 'sinon';
import {LoggerContext} from 'a24-logzio-winston';
import {TestUtilsLogger} from '../tools/TestUtilsLogger';
import {assert} from 'chai';
import {AddAgencyClientConsultantCommandHandler} from '../../src/AgencyClient/command-handlers/AddAgencyClientConsultantCommandHandler';
import {AgencyClientRepository} from '../../src/AgencyClient/AgencyClientRepository';
import {AgencyClientCommandBus} from '../../src/AgencyClient/AgencyClientCommandBus';
import {AgencyClientCommandEnum} from '../../src/AgencyClient/types';
import {RemoveAgencyClientConsultantCommandHandler} from '../../src/AgencyClient/command-handlers/RemoveAgencyClientConsultantCommandHandler';
import {EventRepository} from '../../src/EventRepository';
import {EventStore} from '../../src/models/EventStore';

describe('AgencyClientCommandBus', () => {
  let logger: typeof LoggerContext;
  let agencyClientCommandBus: AgencyClientCommandBus;
  let agencyClientRepository: AgencyClientRepository;

  beforeEach(() => {
    logger = TestUtilsLogger.getLogger(sinon.spy());
    agencyClientCommandBus = new AgencyClientCommandBus();
    agencyClientRepository = new AgencyClientRepository(new EventRepository(EventStore, 'some-id'));
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('addHandler()', () => {
    it('should return class instance', () => {
      const instance = agencyClientCommandBus.addHandler(
        new AddAgencyClientConsultantCommandHandler(agencyClientRepository)
      );

      assert.deepEqual(instance, agencyClientCommandBus, 'Expected class instance not returned');
    });
  });

  describe('execute()', () => {
    const agencyId = '6141d9cb9fb4b44d53469145';
    const clientId = '6141d9cb9fb4b44d53469151';
    const command = {
      type: AgencyClientCommandEnum.ADD_AGENCY_CLIENT_CONSULTANT,
      data: {
        consultant_role_id: '6141d9cb9fb4b44d5346914d',
        consultant_id: '6141d9cb9fb4b44d5346914e'
      }
    };

    it('should throw an error when there is no handler for the command', async () => {
      await agencyClientCommandBus
        .execute(agencyId, clientId, command)
        .should.be.rejectedWith(Error, `Command type:${command.type} is not supported`);
    });

    it('should use the correct handler', async () => {
      const handler = new AddAgencyClientConsultantCommandHandler(agencyClientRepository);
      const executeStub = sinon.stub(handler, 'execute');

      agencyClientCommandBus
        .addHandler(new RemoveAgencyClientConsultantCommandHandler(agencyClientRepository))
        .addHandler(handler);
      executeStub.resolves();

      await agencyClientCommandBus.execute(agencyId, clientId, command);
      executeStub.should.have.been.calledOnceWith(agencyId, clientId, command.data);
    });
  });
});
