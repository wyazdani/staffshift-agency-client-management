import sinon, {stubInterface} from 'ts-sinon';
import {EventStoreErrorEncoder} from '../../../../src/BulkProcessManager/EventStoreErrorEncoder';
import {CommandBusHelper} from '../../../../src/BulkProcessManager/processes/PaymentTerm/CommandBusHelper';
import {RetryableApplyPaymentTerm} from '../../../../src/BulkProcessManager/processes/PaymentTerm/RetryableApplyPaymentTerm';
import {RetryService, RetryableError} from '../../../../src/BulkProcessManager/RetryService';
import {SequenceIdMismatch} from '../../../../src/errors/SequenceIdMismatch';
import {TestUtilsLogger} from '../../../tools/TestUtilsLogger';

describe('RetryableApplyPaymentTerm', () => {
  afterEach(() => {
    sinon.restore();
  });
  const clientId = 'clientId';

  describe('applyPaymentTerm()', () => {
    it('Test success scenario', async () => {
      const exec = sinon.stub(RetryService.prototype, 'exec').callsFake((func) => func());
      const commandBusHelper = stubInterface<CommandBusHelper>();

      commandBusHelper.succeedItem.resolves();
      commandBusHelper.applyPaymentTerm.resolves();
      const retryableApplyPaymentTerm = new RetryableApplyPaymentTerm(
        2,
        2,
        TestUtilsLogger.getLogger(sinon.spy()),
        commandBusHelper
      );

      (await retryableApplyPaymentTerm.applyPaymentTerm(clientId, 'credit')).should.be.true;
      commandBusHelper.succeedItem.should.have.been.calledOnceWith(clientId);
      commandBusHelper.applyPaymentTerm.should.have.been.calledOnceWith(clientId, 'credit');
      exec.should.have.been.calledOnce;
    });

    it('Test we are not catching error from succeedItem', async () => {
      const exec = sinon.stub(RetryService.prototype, 'exec').callsFake((func) => func());
      const commandBusHelper = stubInterface<CommandBusHelper>();
      const err = new Error('sample');

      commandBusHelper.succeedItem.rejects(err);
      commandBusHelper.applyPaymentTerm.resolves();
      const retryableApplyPaymentTerm = new RetryableApplyPaymentTerm(
        2,
        2,
        TestUtilsLogger.getLogger(sinon.spy()),
        commandBusHelper
      );

      await retryableApplyPaymentTerm
        .applyPaymentTerm(clientId, 'credit')
        .should.have.been.rejectedWith(Error, 'sample');
      commandBusHelper.succeedItem.should.have.been.calledOnceWith(clientId);
      commandBusHelper.applyPaymentTerm.should.have.been.calledOnceWith(clientId, 'credit');
      exec.should.have.been.calledOnce;
    });

    it('Test sequence id mismatch error', async () => {
      const exec = sinon.stub(RetryService.prototype, 'exec').callsFake(async (func) => {
        await func().should.have.been.rejectedWith(RetryableError);
      });
      const commandBusHelper = stubInterface<CommandBusHelper>();

      commandBusHelper.succeedItem.resolves();
      const seqError = new SequenceIdMismatch('oops');

      commandBusHelper.applyPaymentTerm.rejects(seqError);
      const retryableApplyPaymentTerm = new RetryableApplyPaymentTerm(
        2,
        2,
        TestUtilsLogger.getLogger(sinon.spy()),
        commandBusHelper
      );

      (await retryableApplyPaymentTerm.applyPaymentTerm(clientId, 'credit')).should.be.true;
      commandBusHelper.succeedItem.should.have.been.calledOnceWith(clientId);
      commandBusHelper.applyPaymentTerm.should.have.been.calledOnceWith(clientId, 'credit');
      exec.should.have.been.calledOnce;
    });

    it('Test unknown error', async () => {
      const exec = sinon.stub(RetryService.prototype, 'exec').callsFake(async (func) => {
        await func().should.have.been.rejectedWith(RetryableError);
      });
      const commandBusHelper = stubInterface<CommandBusHelper>();

      commandBusHelper.succeedItem.resolves();

      commandBusHelper.applyPaymentTerm.rejects(new Error('oops'));
      const retryableApplyPaymentTerm = new RetryableApplyPaymentTerm(
        2,
        2,
        TestUtilsLogger.getLogger(sinon.spy()),
        commandBusHelper
      );

      (await retryableApplyPaymentTerm.applyPaymentTerm(clientId, 'credit')).should.be.true;
      commandBusHelper.succeedItem.should.have.been.calledOnceWith(clientId);
      commandBusHelper.applyPaymentTerm.should.have.been.calledOnceWith(clientId, 'credit');
      exec.should.have.been.calledOnce;
    });
    it('Test fail when retry fails', async () => {
      const err = new Error('oops');
      const exec = sinon.stub(RetryService.prototype, 'exec').rejects(err);
      const commandBusHelper = stubInterface<CommandBusHelper>();

      commandBusHelper.failItem.resolves();
      sinon.stub(RetryService.prototype, 'getErrors').returns([err]);
      const retryableApplyPaymentTerm = new RetryableApplyPaymentTerm(
        2,
        2,
        TestUtilsLogger.getLogger(sinon.spy()),
        commandBusHelper
      );

      (await retryableApplyPaymentTerm.applyPaymentTerm(clientId, 'credit')).should.be.false;
      commandBusHelper.failItem.should.have.been.calledOnceWith(clientId, EventStoreErrorEncoder.encodeArray([err]));
      exec.should.have.been.calledOnce;
    });
  });

  describe('applyInheritedPaymentTerm()', () => {
    it('Test success scenario', async () => {
      const exec = sinon.stub(RetryService.prototype, 'exec').callsFake((func) => func());
      const commandBusHelper = stubInterface<CommandBusHelper>();

      commandBusHelper.succeedItem.resolves();
      commandBusHelper.applyInheritedPaymentTerm.resolves();
      const retryableApplyPaymentTerm = new RetryableApplyPaymentTerm(
        2,
        2,
        TestUtilsLogger.getLogger(sinon.spy()),
        commandBusHelper
      );

      (await retryableApplyPaymentTerm.applyInheritedPaymentTerm(clientId, 'credit', false)).should.be.true;
      commandBusHelper.succeedItem.should.have.been.calledOnceWith(clientId);
      commandBusHelper.applyInheritedPaymentTerm.should.have.been.calledOnceWith(clientId, 'credit', false);
      exec.should.have.been.calledOnce;
    });

    it('Test we are not catching the error from succedItem', async () => {
      const exec = sinon.stub(RetryService.prototype, 'exec').callsFake((func) => func());
      const commandBusHelper = stubInterface<CommandBusHelper>();
      const error = new Error('sample');

      commandBusHelper.succeedItem.rejects(error);
      commandBusHelper.applyInheritedPaymentTerm.resolves();
      const retryableApplyPaymentTerm = new RetryableApplyPaymentTerm(
        2,
        2,
        TestUtilsLogger.getLogger(sinon.spy()),
        commandBusHelper
      );

      await retryableApplyPaymentTerm
        .applyInheritedPaymentTerm(clientId, 'credit', false)
        .should.have.been.rejectedWith(Error, 'sample');
      commandBusHelper.succeedItem.should.have.been.calledOnceWith(clientId);
      commandBusHelper.applyInheritedPaymentTerm.should.have.been.calledOnceWith(clientId, 'credit', false);
      exec.should.have.been.calledOnce;
    });

    it('Test sequence id mismatch error', async () => {
      const exec = sinon.stub(RetryService.prototype, 'exec').callsFake(async (func) => {
        await func().should.have.been.rejectedWith(RetryableError);
      });
      const commandBusHelper = stubInterface<CommandBusHelper>();

      commandBusHelper.succeedItem.resolves();
      const seqError = new SequenceIdMismatch('oops');

      commandBusHelper.applyInheritedPaymentTerm.rejects(seqError);
      const retryableApplyPaymentTerm = new RetryableApplyPaymentTerm(
        2,
        2,
        TestUtilsLogger.getLogger(sinon.spy()),
        commandBusHelper
      );

      (await retryableApplyPaymentTerm.applyInheritedPaymentTerm(clientId, 'credit', false)).should.be.true;
      commandBusHelper.succeedItem.should.have.been.calledOnceWith(clientId);
      commandBusHelper.applyInheritedPaymentTerm.should.have.been.calledOnceWith(clientId, 'credit', false);
      exec.should.have.been.calledOnce;
    });

    it('Test unknown error', async () => {
      const exec = sinon.stub(RetryService.prototype, 'exec').callsFake(async (func) => {
        await func().should.have.been.rejectedWith(RetryableError);
      });
      const commandBusHelper = stubInterface<CommandBusHelper>();

      commandBusHelper.succeedItem.resolves();

      commandBusHelper.applyInheritedPaymentTerm.rejects(new Error('oops'));
      const retryableApplyPaymentTerm = new RetryableApplyPaymentTerm(
        2,
        2,
        TestUtilsLogger.getLogger(sinon.spy()),
        commandBusHelper
      );

      (await retryableApplyPaymentTerm.applyInheritedPaymentTerm(clientId, 'credit', false)).should.be.true;
      commandBusHelper.succeedItem.should.have.been.calledOnceWith(clientId);
      commandBusHelper.applyInheritedPaymentTerm.should.have.been.calledOnceWith(clientId, 'credit');
      exec.should.have.been.calledOnce;
    });
    it('Test fail when retry fails', async () => {
      const err = new Error('oops');
      const exec = sinon.stub(RetryService.prototype, 'exec').rejects(err);
      const commandBusHelper = stubInterface<CommandBusHelper>();

      commandBusHelper.failItem.resolves();
      sinon.stub(RetryService.prototype, 'getErrors').returns([err]);
      const retryableApplyPaymentTerm = new RetryableApplyPaymentTerm(
        2,
        2,
        TestUtilsLogger.getLogger(sinon.spy()),
        commandBusHelper
      );

      (await retryableApplyPaymentTerm.applyInheritedPaymentTerm(clientId, 'credit', false)).should.be.false;
      commandBusHelper.failItem.should.have.been.calledOnceWith(clientId, EventStoreErrorEncoder.encodeArray([err]));
      exec.should.have.been.calledOnce;
    });
  });
});
