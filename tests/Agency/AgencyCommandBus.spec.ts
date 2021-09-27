import sinon from 'sinon';
import {assert} from 'chai';
import {TestUtilsLogger} from '../tools/TestUtilsLogger';
import {LoggerContext} from 'a24-logzio-winston';
import {AgencyCommandBus} from '../../src/Agency/AgencyCommandBus';
import {AddAgencyConsultantRoleCommandHandler} from '../../src/Agency/command-handlers/AddAgencyConsultantRoleCommandHandler';
import {AgencyRepository} from '../../src/Agency/AgencyRepository';
import {AgencyCommandEnum} from '../../src/Agency/types';
import {DisableAgencyConsultantRoleCommandHandler} from '../../src/Agency/command-handlers/DisableAgencyConsultantRoleCommandHandler';

describe('AgencyCommandBus', () => {
  let logger: typeof LoggerContext;
  let agencyCommandBus: AgencyCommandBus;
  let agencyRepository: any;

  beforeEach(() => {
    logger = TestUtilsLogger.getLogger(sinon.spy());
    agencyCommandBus = new AgencyCommandBus();
    agencyRepository = sinon.createStubInstance(AgencyRepository);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('addHandler()', () => {
    it('should return class instance', () => {
      const instance = agencyCommandBus.addHandler(new AddAgencyConsultantRoleCommandHandler(agencyRepository));

      assert.deepEqual(instance, agencyCommandBus, 'Expected class instance not returned');
    });
  });

  describe('execute()', () => {
    const agencyId = '6141d9cb9fb4b44d53469145';
    const command = {
      type: AgencyCommandEnum.ADD_AGENCY_CONSULTANT_ROLE,
      data: {
        id: 'some id',
        name: 'OOH',
        description: 'out of hours consultants',
        max_consultants: 5
      }
    };

    it('should throw an error when there is no handler for the command', async () => {
      await agencyCommandBus
        .execute(agencyId, command)
        .should.be.rejectedWith(Error, `Command type:${command.type} is not supported`);
    });

    it('should use the correct handler', async () => {
      const handler = new AddAgencyConsultantRoleCommandHandler(agencyRepository);
      const executeStub = sinon.stub(handler, 'execute');

      agencyCommandBus.addHandler(new DisableAgencyConsultantRoleCommandHandler(agencyRepository)).addHandler(handler);
      executeStub.resolves();

      await agencyCommandBus.execute(agencyId, command);
      executeStub.should.have.been.calledOnceWith(agencyId, command.data);
    });
  });
});
