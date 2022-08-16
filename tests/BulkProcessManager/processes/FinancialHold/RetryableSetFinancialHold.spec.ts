import sinon, {stubInterface} from 'ts-sinon';
import {EventStoreErrorEncoder} from '../../../../src/BulkProcessManager/EventStoreErrorEncoder';
import {CommandBusHelper} from '../../../../src/BulkProcessManager/processes/FinancialHold/CommandBusHelper';
import {RetryableSetFinancialHold} from '../../../../src/BulkProcessManager/processes/FinancialHold/RetryableSetFinancialHold';
import {RetryService, RetryableError} from '../../../../src/BulkProcessManager/RetryService';
import {SequenceIdMismatch} from '../../../../src/errors/SequenceIdMismatch';
import {TestUtilsLogger} from '../../../tools/TestUtilsLogger';

describe('RetryableSetFinancialHold', () => {
  afterEach(() => {
    sinon.restore();
  });
  const clientId = 'clientId';

  describe('setFinancialHold()', () => {
    it('Test success scenario', async () => {
      const exec = sinon.stub(RetryService.prototype, 'exec').callsFake((func) => func());
      const commandBusHelper = stubInterface<CommandBusHelper>();

      commandBusHelper.succeedItem.resolves();
      commandBusHelper.setFinancialHold.resolves();
      const retryableSetFinancialHold = new RetryableSetFinancialHold(
        2,
        2,
        TestUtilsLogger.getLogger(sinon.spy()),
        commandBusHelper
      );

      (await retryableSetFinancialHold.setFinancialHold(clientId, true, 'sample')).should.be.true;
      commandBusHelper.succeedItem.should.have.been.calledOnceWith(clientId);
      commandBusHelper.setFinancialHold.should.have.been.calledOnceWith(clientId, true, 'sample');
      exec.should.have.been.calledOnce;
    });

    it('Test we are not catching error from succeedItem', async () => {
      const exec = sinon.stub(RetryService.prototype, 'exec').callsFake((func) => func());
      const commandBusHelper = stubInterface<CommandBusHelper>();
      const err = new Error('sample');

      commandBusHelper.succeedItem.rejects(err);
      commandBusHelper.setFinancialHold.resolves();
      const retryableSetFinancialHold = new RetryableSetFinancialHold(
        2,
        2,
        TestUtilsLogger.getLogger(sinon.spy()),
        commandBusHelper
      );

      await retryableSetFinancialHold
        .setFinancialHold(clientId, true, 'sample note')
        .should.have.been.rejectedWith(Error, 'sample');
      commandBusHelper.succeedItem.should.have.been.calledOnceWith(clientId);
      commandBusHelper.setFinancialHold.should.have.been.calledOnceWith(clientId, true, 'sample note');
      exec.should.have.been.calledOnce;
    });

    it('Test sequence id mismatch error', async () => {
      const exec = sinon.stub(RetryService.prototype, 'exec').callsFake(async (func) => {
        await func().should.have.been.rejectedWith(RetryableError);
      });
      const commandBusHelper = stubInterface<CommandBusHelper>();

      commandBusHelper.succeedItem.resolves();
      const seqError = new SequenceIdMismatch('oops');

      commandBusHelper.setFinancialHold.rejects(seqError);
      const retryableSetFinancialHold = new RetryableSetFinancialHold(
        2,
        2,
        TestUtilsLogger.getLogger(sinon.spy()),
        commandBusHelper
      );

      (await retryableSetFinancialHold.setFinancialHold(clientId, true, 'sample note')).should.be.true;
      commandBusHelper.succeedItem.should.have.been.calledOnceWith(clientId);
      commandBusHelper.setFinancialHold.should.have.been.calledOnceWith(clientId, true, 'sample note');
      exec.should.have.been.calledOnce;
    });

    it('Test unknown error', async () => {
      const exec = sinon.stub(RetryService.prototype, 'exec').callsFake(async (func) => {
        await func().should.have.been.rejectedWith(RetryableError);
      });
      const commandBusHelper = stubInterface<CommandBusHelper>();

      commandBusHelper.succeedItem.resolves();

      commandBusHelper.setFinancialHold.rejects(new Error('oops'));
      const retryableSetFinancialHold = new RetryableSetFinancialHold(
        2,
        2,
        TestUtilsLogger.getLogger(sinon.spy()),
        commandBusHelper
      );

      (await retryableSetFinancialHold.setFinancialHold(clientId, true, 'sample note')).should.be.true;
      commandBusHelper.succeedItem.should.have.been.calledOnceWith(clientId);
      commandBusHelper.setFinancialHold.should.have.been.calledOnceWith(clientId, true, 'sample note');
      exec.should.have.been.calledOnce;
    });
    it('Test fail when retry fails', async () => {
      const err = new Error('oops');
      const exec = sinon.stub(RetryService.prototype, 'exec').rejects(err);
      const commandBusHelper = stubInterface<CommandBusHelper>();

      commandBusHelper.failItem.resolves();
      sinon.stub(RetryService.prototype, 'getErrors').returns([err]);
      const retryableSetFinancialHold = new RetryableSetFinancialHold(
        2,
        2,
        TestUtilsLogger.getLogger(sinon.spy()),
        commandBusHelper
      );

      (await retryableSetFinancialHold.setFinancialHold(clientId, true, 'sample note')).should.be.false;
      commandBusHelper.failItem.should.have.been.calledOnceWith(clientId, EventStoreErrorEncoder.encodeArray([err]));
      exec.should.have.been.calledOnce;
    });
  });

  describe('setInheritedFinancialHold()', () => {
    it('Test success scenario', async () => {
      const exec = sinon.stub(RetryService.prototype, 'exec').callsFake((func) => func());
      const commandBusHelper = stubInterface<CommandBusHelper>();

      commandBusHelper.succeedItem.resolves();
      commandBusHelper.setInheritedFinancialHold.resolves();
      const retryableSetFinancialHold = new RetryableSetFinancialHold(
        2,
        2,
        TestUtilsLogger.getLogger(sinon.spy()),
        commandBusHelper
      );

      (await retryableSetFinancialHold.setInheritedFinancialHold(clientId, true, 'note', false)).should.be.true;
      commandBusHelper.succeedItem.should.have.been.calledOnceWith(clientId);
      commandBusHelper.setInheritedFinancialHold.should.have.been.calledOnceWith(clientId, true, 'note', false);
      exec.should.have.been.calledOnce;
    });

    it('Test we are not catching the error from succeedItem', async () => {
      const exec = sinon.stub(RetryService.prototype, 'exec').callsFake((func) => func());
      const commandBusHelper = stubInterface<CommandBusHelper>();
      const error = new Error('sample');

      commandBusHelper.succeedItem.rejects(error);
      commandBusHelper.setInheritedFinancialHold.resolves();
      const retryableSetFinancialHold = new RetryableSetFinancialHold(
        2,
        2,
        TestUtilsLogger.getLogger(sinon.spy()),
        commandBusHelper
      );

      await retryableSetFinancialHold
        .setInheritedFinancialHold(clientId, true, 'note', false)
        .should.have.been.rejectedWith(Error, 'sample');
      commandBusHelper.succeedItem.should.have.been.calledOnceWith(clientId);
      commandBusHelper.setInheritedFinancialHold.should.have.been.calledOnceWith(clientId, true, 'note', false);
      exec.should.have.been.calledOnce;
    });

    it('Test sequence id mismatch error', async () => {
      const exec = sinon.stub(RetryService.prototype, 'exec').callsFake(async (func) => {
        await func().should.have.been.rejectedWith(RetryableError);
      });
      const commandBusHelper = stubInterface<CommandBusHelper>();

      commandBusHelper.succeedItem.resolves();
      const seqError = new SequenceIdMismatch('oops');

      commandBusHelper.setInheritedFinancialHold.rejects(seqError);
      const retryableSetFinancialHold = new RetryableSetFinancialHold(
        2,
        2,
        TestUtilsLogger.getLogger(sinon.spy()),
        commandBusHelper
      );

      (await retryableSetFinancialHold.setInheritedFinancialHold(clientId, true, 'note', false)).should.be.true;
      commandBusHelper.succeedItem.should.have.been.calledOnceWith(clientId);
      commandBusHelper.setInheritedFinancialHold.should.have.been.calledOnceWith(clientId, true, 'note', false);
      exec.should.have.been.calledOnce;
    });

    it('Test unknown error', async () => {
      const exec = sinon.stub(RetryService.prototype, 'exec').callsFake(async (func) => {
        await func().should.have.been.rejectedWith(RetryableError);
      });
      const commandBusHelper = stubInterface<CommandBusHelper>();

      commandBusHelper.succeedItem.resolves();

      commandBusHelper.setInheritedFinancialHold.rejects(new Error('oops'));
      const retryableSetFinancialHold = new RetryableSetFinancialHold(
        2,
        2,
        TestUtilsLogger.getLogger(sinon.spy()),
        commandBusHelper
      );

      (await retryableSetFinancialHold.setInheritedFinancialHold(clientId, true, 'note', false)).should.be.true;
      commandBusHelper.succeedItem.should.have.been.calledOnceWith(clientId);
      commandBusHelper.setInheritedFinancialHold.should.have.been.calledOnceWith(clientId, true, 'note', false);
      exec.should.have.been.calledOnce;
    });
    it('Test fail when retry fails', async () => {
      const err = new Error('oops');
      const exec = sinon.stub(RetryService.prototype, 'exec').rejects(err);
      const commandBusHelper = stubInterface<CommandBusHelper>();

      commandBusHelper.failItem.resolves();
      sinon.stub(RetryService.prototype, 'getErrors').returns([err]);
      const retryableSetFinancialHold = new RetryableSetFinancialHold(
        2,
        2,
        TestUtilsLogger.getLogger(sinon.spy()),
        commandBusHelper
      );

      (await retryableSetFinancialHold.setInheritedFinancialHold(clientId, true, 'note', false)).should.be.false;
      commandBusHelper.failItem.should.have.been.calledOnceWith(clientId, EventStoreErrorEncoder.encodeArray([err]));
      exec.should.have.been.calledOnce;
    });
  });
});
