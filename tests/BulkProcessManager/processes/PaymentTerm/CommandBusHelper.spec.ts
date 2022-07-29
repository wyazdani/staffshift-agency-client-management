import sinon, {stubInterface, StubbedInstance} from 'ts-sinon';
import {ClientInheritanceProcessCommandEnum} from '../../../../src/aggregates/ClientInheritanceProcess/types';
import {CommandBus} from '../../../../src/aggregates/CommandBus';
import {PaymentTermCommandEnum} from '../../../../src/aggregates/PaymentTerm/types';
import {CommandBusHelper} from '../../../../src/BulkProcessManager/processes/PaymentTerm/CommandBusHelper';

describe('CommandBusHelper', () => {
  const agencyId = 'agency id';
  const jobId = 'job id';
  const clientId = 'client id';

  let commandBus: StubbedInstance<CommandBus>;
  let commandBusHelper: CommandBusHelper;

  beforeEach(() => {
    commandBus = stubInterface<CommandBus>();
    commandBus.execute.resolves();
    commandBusHelper = new CommandBusHelper(commandBus, agencyId, jobId);
  });
  afterEach(() => {
    sinon.restore();
  });

  describe('startProcess()', () => {
    it('test running the command', async () => {
      await commandBusHelper.startProcess(10);
      commandBus.execute.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'client_inheritance_process',
          agency_id: agencyId,
          job_id: jobId
        },
        type: ClientInheritanceProcessCommandEnum.START_INHERITANCE_PROCESS,
        data: {
          estimated_count: 10
        }
      });
    });
  });

  describe('applyPaymentTerm()', () => {
    it('test running the command', async () => {
      const term = 'pay_in_advance';

      await commandBusHelper.applyPaymentTerm(clientId, term);
      commandBus.execute.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'payment_term',
          agency_id: agencyId,
          client_id: clientId
        },
        type: PaymentTermCommandEnum.APPLY_PAYMENT_TERM,
        data: {term}
      });
    });
  });

  describe('succeedItem()', () => {
    it('test running the command', async () => {
      await commandBusHelper.succeedItem(clientId);
      commandBus.execute.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'client_inheritance_process',
          agency_id: agencyId,
          job_id: jobId
        },
        type: ClientInheritanceProcessCommandEnum.SUCCEED_ITEM_INHERITANCE_PROCESS,
        data: {
          client_id: clientId
        }
      });
    });
  });

  describe('failItem()', () => {
    it('test running the command', async () => {
      const errors = [{code: 'sample', message: 'oops'}];

      await commandBusHelper.failItem(clientId, errors);
      commandBus.execute.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'client_inheritance_process',
          agency_id: agencyId,
          job_id: jobId
        },
        type: ClientInheritanceProcessCommandEnum.FAIL_ITEM_INHERITANCE_PROCESS,
        data: {
          client_id: clientId,
          errors
        }
      });
    });
  });

  describe('applyInheritedPaymentTerm()', () => {
    it('test running the command', async () => {
      const term = 'pay_in_advance';

      await commandBusHelper.applyInheritedPaymentTerm(clientId, term, false);
      commandBus.execute.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'payment_term',
          agency_id: agencyId,
          client_id: clientId
        },
        type: PaymentTermCommandEnum.APPLY_INHERITED_PAYMENT_TERM,
        data: {term, force: false}
      });
    });
  });

  describe('completeProcess()', () => {
    it('test running the command', async () => {
      await commandBusHelper.completeProcess();
      commandBus.execute.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'client_inheritance_process',
          agency_id: agencyId,
          job_id: jobId
        },
        type: ClientInheritanceProcessCommandEnum.COMPLETE_INHERITANCE_PROCESS,
        data: {}
      });
    });
  });
});
