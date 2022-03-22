import {LoggerContext} from 'a24-logzio-winston';
import {assert} from 'chai';
import {describe} from 'mocha';
import {SinonStub} from 'sinon';
import sinon from 'ts-sinon';
import {EventStoreErrorEncoder} from '../../../../src/BulkProcessManager/EventStoreErrorEncoder';
import {ConsultantAssignProcess} from '../../../../src/BulkProcessManager/processes/ConsultantAssignProcess/ConsultantAssignProcess';
import {EventStoreHelper} from '../../../../src/BulkProcessManager/processes/ConsultantAssignProcess/EventStoreHelper';
import {RetryService, RetryableError, NonRetryableError} from '../../../../src/BulkProcessManager/RetryService';
import {SequenceIdMismatch} from '../../../../src/errors/SequenceIdMismatch';
import {TestUtilsLogger} from '../../../tools/TestUtilsLogger';
import {ValidationError, ResourceNotFoundError} from 'a24-node-error-utils';

describe('ConsultantAssignProcess', () => {
  let logger: LoggerContext;
  let execRetryService: SinonStub;
  const encodedError: any = {sample: 'ok'};

  beforeEach(() => {
    logger = TestUtilsLogger.getLogger(sinon.spy());
    execRetryService = sinon.stub(RetryService.prototype, 'exec');
    const errors = [new Error('sample new')];

    sinon.stub(RetryService.prototype, 'getErrors').returns(errors);
    sinon.stub(EventStoreErrorEncoder, 'encodeArray').returns(encodedError);
  });
  afterEach(() => {
    sinon.restore();
  });
  const agencyId = 'agency id';
  const correlationId = 'correlation id';
  const metaData = {user_id: 'sample'};
  const clientId = 'A';
  const initiateEvent: any = {
    _id: 'event id',
    aggregate_id: {
      name: 'aggregate name',
      agency_id: agencyId
    },
    correlation_id: correlationId,
    created_at: new Date().toString(),
    data: {
      _id: 'initiateJobId',
      consultant_id: 'consultant id',
      consultant_role_id: 'consultant role id',
      client_ids: [clientId]
    },
    meta_data: metaData
  };

  const opts = {
    maxRetry: 2,
    retryDelay: 1000
  };

  describe('execute()', () => {
    it('Test success scenario', async () => {
      const startProcess = sinon.stub(EventStoreHelper.prototype, 'startProcess').resolves();
      const assignConsultantToClient = sinon.stub(EventStoreHelper.prototype, 'assignConsultantToClient').resolves();
      const succeedItemProcess = sinon.stub(EventStoreHelper.prototype, 'succeedItemProcess').resolves();
      const completeProcess = sinon.stub(EventStoreHelper.prototype, 'completeProcess').resolves();

      execRetryService.callsFake((func) => func());
      const process = new ConsultantAssignProcess(logger, opts);

      await process.execute(initiateEvent);
      startProcess.should.have.been.calledOnce;
      assignConsultantToClient.should.have.been.calledOnceWith(
        initiateEvent.data.consultant_role_id,
        initiateEvent.data.consultant_id,
        clientId
      );
      succeedItemProcess.should.have.been.calledOnceWith(clientId);
      completeProcess.should.have.been.calledOnce;
      execRetryService.should.have.been.calledOnce;

      //Test  complete functionality
      const completeConsultantJob = sinon.stub(EventStoreHelper.prototype, 'completeConsultantJob').resolves();

      await process.complete();
      completeConsultantJob.should.have.been.calledWith(initiateEvent.aggregate_id.agency_id, initiateEvent.data._id);
    });

    it('Test sequence id mismatch error', async () => {
      const startProcess = sinon.stub(EventStoreHelper.prototype, 'startProcess').resolves();
      const assignConsultantToClient = sinon
        .stub(EventStoreHelper.prototype, 'assignConsultantToClient')
        .rejects(new SequenceIdMismatch('sample'));
      const failItemProcess = sinon.stub(EventStoreHelper.prototype, 'failItemProcess').resolves();
      const succeedItemProcess = sinon.stub(EventStoreHelper.prototype, 'succeedItemProcess').resolves();
      const completeProcess = sinon.stub(EventStoreHelper.prototype, 'completeProcess').resolves();

      execRetryService.callsFake((func) => {
        assert.throws(() => func(), RetryableError);
        throw new Error('sample');
      });

      const process = new ConsultantAssignProcess(logger, opts);

      await process.execute(initiateEvent);
      startProcess.should.have.been.calledOnce;
      assignConsultantToClient.should.have.been.calledOnceWith(
        initiateEvent.data.consultant_role_id,
        initiateEvent.data.consultant_id,
        clientId
      );
      failItemProcess.should.have.been.calledOnceWith(clientId, encodedError);
      succeedItemProcess.should.not.have.been.called;
      completeProcess.should.have.been.calledOnce;
      execRetryService.should.have.been.calledOnce;
    });

    it('Test ValidationError error', async () => {
      const startProcess = sinon.stub(EventStoreHelper.prototype, 'startProcess').resolves();
      const assignConsultantToClient = sinon
        .stub(EventStoreHelper.prototype, 'assignConsultantToClient')
        .rejects(new ValidationError('sample'));
      const failItemProcess = sinon.stub(EventStoreHelper.prototype, 'failItemProcess').resolves();
      const succeedItemProcess = sinon.stub(EventStoreHelper.prototype, 'succeedItemProcess').resolves();
      const completeProcess = sinon.stub(EventStoreHelper.prototype, 'completeProcess').resolves();

      execRetryService.callsFake((func) => {
        assert.throws(() => func(), NonRetryableError);
        throw new Error('sample');
      });
      const process = new ConsultantAssignProcess(logger, opts);

      await process.execute(initiateEvent);
      startProcess.should.have.been.calledOnce;
      assignConsultantToClient.should.have.been.calledOnceWith(
        initiateEvent.data.consultant_role_id,
        initiateEvent.data.consultant_id,
        clientId
      );
      failItemProcess.should.have.been.calledOnceWith(clientId, encodedError);
      succeedItemProcess.should.not.have.been.called;
      completeProcess.should.have.been.calledOnce;
      execRetryService.should.have.been.calledOnce;
    });
    it('Test ResourceNotFoundError error', async () => {
      const startProcess = sinon.stub(EventStoreHelper.prototype, 'startProcess').resolves();
      const assignConsultantToClient = sinon
        .stub(EventStoreHelper.prototype, 'assignConsultantToClient')
        .rejects(new ResourceNotFoundError('sample'));
      const failItemProcess = sinon.stub(EventStoreHelper.prototype, 'failItemProcess').resolves();
      const succeedItemProcess = sinon.stub(EventStoreHelper.prototype, 'succeedItemProcess').resolves();
      const completeProcess = sinon.stub(EventStoreHelper.prototype, 'completeProcess').resolves();

      execRetryService.callsFake((func) => {
        assert.throws(() => func(), NonRetryableError);
        throw new Error('sample');
      });
      const process = new ConsultantAssignProcess(logger, opts);

      await process.execute(initiateEvent);
      startProcess.should.have.been.calledOnce;
      assignConsultantToClient.should.have.been.calledOnceWith(
        initiateEvent.data.consultant_role_id,
        initiateEvent.data.consultant_id,
        clientId
      );
      failItemProcess.should.have.been.calledOnceWith(clientId, encodedError);
      succeedItemProcess.should.not.have.been.called;
      completeProcess.should.have.been.calledOnce;
      execRetryService.should.have.been.calledOnce;
    });

    it('Test unknown error', async () => {
      const startProcess = sinon.stub(EventStoreHelper.prototype, 'startProcess').resolves();
      const assignConsultantToClient = sinon
        .stub(EventStoreHelper.prototype, 'assignConsultantToClient')
        .rejects(new Error('sample'));
      const failItemProcess = sinon.stub(EventStoreHelper.prototype, 'failItemProcess').resolves();
      const succeedItemProcess = sinon.stub(EventStoreHelper.prototype, 'succeedItemProcess').resolves();
      const completeProcess = sinon.stub(EventStoreHelper.prototype, 'completeProcess').resolves();

      execRetryService.callsFake((func) => {
        assert.throws(() => func(), Error);
        throw new Error('sample');
      });
      const process = new ConsultantAssignProcess(logger, opts);

      await process.execute(initiateEvent);
      startProcess.should.have.been.calledOnce;
      assignConsultantToClient.should.have.been.calledOnceWith(
        initiateEvent.data.consultant_role_id,
        initiateEvent.data.consultant_id,
        clientId
      );
      failItemProcess.should.have.been.calledOnceWith(clientId, encodedError);
      succeedItemProcess.should.not.have.been.called;
      completeProcess.should.have.been.calledOnce;
      execRetryService.should.have.been.calledOnce;
    });
  });
});
