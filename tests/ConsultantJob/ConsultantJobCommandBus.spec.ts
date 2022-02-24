import sinon from 'sinon';
import {stubConstructor} from 'ts-sinon';
import {LoggerContext} from 'a24-logzio-winston';
import {TestUtilsLogger} from '../tools/TestUtilsLogger';
import {assert} from 'chai';
import {AssignConsultantCommandHandler} from '../../src/ConsultantJob/command-handlers/AssignConsultantCommandHandler';
import {ConsultantJobRepository} from '../../src/ConsultantJob/ConsultantJobRepository';
import {ConsultantJobCommandBus} from '../../src/ConsultantJob/ConsultantJobCommandBus';
import {ConsultantJobCommandEnum} from '../../src/ConsultantJob/types';

describe('ConsultantJobCommandBus', () => {
  let logger: LoggerContext;
  let consultantCommandBus: ConsultantJobCommandBus;
  let consultantRepository: ConsultantJobRepository;

  beforeEach(() => {
    logger = TestUtilsLogger.getLogger(sinon.spy());
    consultantCommandBus = new ConsultantJobCommandBus();
    consultantRepository = stubConstructor(ConsultantJobRepository);
  });

  describe('addHandler()', () => {
    it('should return class instance', () => {
      const instance = consultantCommandBus.addHandler(new AssignConsultantCommandHandler(consultantRepository));

      assert.deepEqual(instance, consultantCommandBus, 'Expected class instance not returned');
    });
  });

  describe('execute()', () => {
    const agencyId = '6141d9cb9fb4b44d53469145';
    const command: any = {
      type: ConsultantJobCommandEnum.ASSIGN_CONSULTANT,
      data: {sample: 'ok'}
    };

    it('should throw an error when there is no handler for the command', async () => {
      await consultantCommandBus
        .execute(agencyId, command)
        .should.be.rejectedWith(Error, `Command type:${command.type} is not supported`);
    });

    it('should use the correct handler', async () => {
      const handler = new AssignConsultantCommandHandler(consultantRepository);
      const executeStub = sinon.stub(handler, 'execute');

      consultantCommandBus.addHandler(handler);
      executeStub.resolves();

      await consultantCommandBus.execute(agencyId, command);
      executeStub.should.have.been.calledOnceWith(agencyId, command.data);
    });
  });
});
