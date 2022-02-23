import sinon from 'sinon';
import {stubConstructor} from 'ts-sinon';
import {LoggerContext} from 'a24-logzio-winston';
import {TestUtilsLogger} from '../tools/TestUtilsLogger';
import {assert} from 'chai';
import {AssignConsultantCommandHandler} from '../../src/Consultant/command-handlers/AssignConsultantCommandHandler';
import {ConsultantRepository} from '../../src/Consultant/ConsultantRepository';
import {ConsultantCommandBus} from '../../src/Consultant/ConsultantCommandBus';
import {ConsultantCommandEnum} from '../../src/Consultant/types';

describe('ConsultantCommandBus', () => {
  let logger: LoggerContext;
  let consultantCommandBus: ConsultantCommandBus;
  let consultantRepository: ConsultantRepository;

  beforeEach(() => {
    logger = TestUtilsLogger.getLogger(sinon.spy());
    consultantCommandBus = new ConsultantCommandBus();
    consultantRepository = stubConstructor(ConsultantRepository);
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
      type: ConsultantCommandEnum.ASSIGN_CONSULTANT,
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
