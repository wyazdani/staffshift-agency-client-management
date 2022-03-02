import sinon from 'sinon';
import {stubConstructor} from 'ts-sinon';
import {LoggerContext} from 'a24-logzio-winston';
import {TestUtilsLogger} from '../../tools/TestUtilsLogger';
import {assert} from 'chai';
import {StartConsultantAssignCommandHandler} from '../../../src/aggregates/ConsultantJobAssign/command-handlers/StartConsultantAssignCommandHandler';
import {ConsultantJobAssignRepository} from '../../../src/aggregates/ConsultantJobAssign/ConsultantJobAssignRepository';
import {ConsultantJobAssignCommandBus} from '../../../src/aggregates/ConsultantJobAssign/ConsultantJobAssignCommandBus';
import {ConsultantJobAssignCommandEnum} from '../../../src/aggregates/ConsultantJobAssign/types';

describe('ConsultantJobAssignCommandBus', () => {
  let logger: LoggerContext;
  let commandBus: ConsultantJobAssignCommandBus;
  let repository: ConsultantJobAssignRepository;

  beforeEach(() => {
    logger = TestUtilsLogger.getLogger(sinon.spy());
    commandBus = new ConsultantJobAssignCommandBus();
    repository = stubConstructor(ConsultantJobAssignRepository);
  });

  describe('addHandler()', () => {
    it('should return class instance', () => {
      const instance = commandBus.addHandler(new StartConsultantAssignCommandHandler(repository));

      assert.deepEqual(instance, commandBus, 'Expected class instance not returned');
    });
  });

  describe('execute()', () => {
    const jobId = 'job id';
    const agencyId = '6141d9cb9fb4b44d53469145';
    const command: any = {
      type: ConsultantJobAssignCommandEnum.START,
      data: {sample: 'ok'}
    };

    it('should throw an error when there is no handler for the command', async () => {
      await commandBus
        .execute(agencyId, jobId, command)
        .should.be.rejectedWith(Error, `Command type:${command.type} is not supported`);
    });

    it('should use the correct handler', async () => {
      const handler = new StartConsultantAssignCommandHandler(repository);
      const executeStub = sinon.stub(handler, 'execute');

      commandBus.addHandler(handler);
      executeStub.resolves();

      await commandBus.execute(agencyId, jobId, command);
      executeStub.should.have.been.calledOnceWith(agencyId, jobId, command.data);
    });
  });
});
