import {LoggerContext} from 'a24-logzio-winston';
import sinon from 'ts-sinon';
import {ConsultantJobAssignErrorItemEnum} from '../../../../src/aggregates/ConsultantJobAssign/types/ConsultantJobAssignErrorItemEnum';
import {ConsultantAssignProcess} from '../../../../src/BulkProcessManager/processes/ConsultantAssignProcess/ConsultantAssignProcess';
import {EventStoreHelper} from '../../../../src/BulkProcessManager/processes/ConsultantAssignProcess/EventStoreHelper';
import {SequenceIdMismatch} from '../../../../src/errors/SequenceIdMismatch';
import {TestUtilsLogger} from '../../../tools/TestUtilsLogger';
import {ValidationError, ResourceNotFoundError} from 'a24-node-error-utils';

describe('ConsultantAssignProcess', () => {
  let logger: LoggerContext;

  beforeEach(() => {
    logger = TestUtilsLogger.getLogger(sinon.spy());
  });
  afterEach(() => {
    sinon.restore();
  });
  describe('execute()', () => {
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

    it('Test success scenario', async () => {
      const startProcess = sinon.stub(EventStoreHelper.prototype, 'startProcess').resolves();
      const assignConsultantToClient = sinon.stub(EventStoreHelper.prototype, 'assignConsultantToClient').resolves();
      const succeedItemProcess = sinon.stub(EventStoreHelper.prototype, 'succeedItemProcess').resolves();
      const completeProcess = sinon.stub(EventStoreHelper.prototype, 'completeProcess').resolves();
      const process = new ConsultantAssignProcess(logger);

      await process.execute(initiateEvent);
      startProcess.should.have.been.calledOnce;
      assignConsultantToClient.should.have.been.calledOnceWith(
        initiateEvent.data.consultant_role_id,
        initiateEvent.data.consultant_id,
        clientId
      );
      succeedItemProcess.should.have.been.calledOnceWith(clientId);
      completeProcess.should.have.been.calledOnce;
    });

    it('Test sequence id mismatch error', async () => {
      const startProcess = sinon.stub(EventStoreHelper.prototype, 'startProcess').resolves();
      const assignConsultantToClient = sinon
        .stub(EventStoreHelper.prototype, 'assignConsultantToClient')
        .rejects(new SequenceIdMismatch('sample'));
      const failItemProcess = sinon.stub(EventStoreHelper.prototype, 'failItemProcess').resolves();
      const succeedItemProcess = sinon.stub(EventStoreHelper.prototype, 'succeedItemProcess').resolves();
      const completeProcess = sinon.stub(EventStoreHelper.prototype, 'completeProcess').resolves();
      const process = new ConsultantAssignProcess(logger);

      await process.execute(initiateEvent);
      startProcess.should.have.been.calledOnce;
      assignConsultantToClient.should.have.been.calledOnceWith(
        initiateEvent.data.consultant_role_id,
        initiateEvent.data.consultant_id,
        clientId
      );
      failItemProcess.should.have.been.calledOnceWith(
        clientId,
        ConsultantJobAssignErrorItemEnum.SEQUENCE_ID_MISMATCH_ERROR,
        'sample'
      );
      succeedItemProcess.should.not.have.been.called;
      completeProcess.should.have.been.calledOnce;
    });

    it('Test ValidationError error', async () => {
      const startProcess = sinon.stub(EventStoreHelper.prototype, 'startProcess').resolves();
      const assignConsultantToClient = sinon
        .stub(EventStoreHelper.prototype, 'assignConsultantToClient')
        .rejects(new ValidationError('sample'));
      const failItemProcess = sinon.stub(EventStoreHelper.prototype, 'failItemProcess').resolves();
      const succeedItemProcess = sinon.stub(EventStoreHelper.prototype, 'succeedItemProcess').resolves();
      const completeProcess = sinon.stub(EventStoreHelper.prototype, 'completeProcess').resolves();
      const process = new ConsultantAssignProcess(logger);

      await process.execute(initiateEvent);
      startProcess.should.have.been.calledOnce;
      assignConsultantToClient.should.have.been.calledOnceWith(
        initiateEvent.data.consultant_role_id,
        initiateEvent.data.consultant_id,
        clientId
      );
      failItemProcess.should.have.been.calledOnceWith(
        clientId,
        ConsultantJobAssignErrorItemEnum.VALIDATION_ERROR,
        'sample'
      );
      succeedItemProcess.should.not.have.been.called;
      completeProcess.should.have.been.calledOnce;
    });
    it('Test ResourceNotFoundError error', async () => {
      const startProcess = sinon.stub(EventStoreHelper.prototype, 'startProcess').resolves();
      const assignConsultantToClient = sinon
        .stub(EventStoreHelper.prototype, 'assignConsultantToClient')
        .rejects(new ResourceNotFoundError('sample'));
      const failItemProcess = sinon.stub(EventStoreHelper.prototype, 'failItemProcess').resolves();
      const succeedItemProcess = sinon.stub(EventStoreHelper.prototype, 'succeedItemProcess').resolves();
      const completeProcess = sinon.stub(EventStoreHelper.prototype, 'completeProcess').resolves();
      const process = new ConsultantAssignProcess(logger);

      await process.execute(initiateEvent);
      startProcess.should.have.been.calledOnce;
      assignConsultantToClient.should.have.been.calledOnceWith(
        initiateEvent.data.consultant_role_id,
        initiateEvent.data.consultant_id,
        clientId
      );
      failItemProcess.should.have.been.calledOnceWith(
        clientId,
        ConsultantJobAssignErrorItemEnum.VALIDATION_ERROR,
        'sample'
      );
      succeedItemProcess.should.not.have.been.called;
      completeProcess.should.have.been.calledOnce;
    });

    it('Test unknown error', async () => {
      const startProcess = sinon.stub(EventStoreHelper.prototype, 'startProcess').resolves();
      const assignConsultantToClient = sinon
        .stub(EventStoreHelper.prototype, 'assignConsultantToClient')
        .rejects(new Error('sample'));
      const failItemProcess = sinon.stub(EventStoreHelper.prototype, 'failItemProcess').resolves();
      const succeedItemProcess = sinon.stub(EventStoreHelper.prototype, 'succeedItemProcess').resolves();
      const completeProcess = sinon.stub(EventStoreHelper.prototype, 'completeProcess').resolves();
      const process = new ConsultantAssignProcess(logger);

      await process.execute(initiateEvent);
      startProcess.should.have.been.calledOnce;
      assignConsultantToClient.should.have.been.calledOnceWith(
        initiateEvent.data.consultant_role_id,
        initiateEvent.data.consultant_id,
        clientId
      );
      failItemProcess.should.have.been.calledOnceWith(
        clientId,
        ConsultantJobAssignErrorItemEnum.UNKNOWN_ERROR,
        'sample'
      );
      succeedItemProcess.should.not.have.been.called;
      completeProcess.should.have.been.calledOnce;
    });
  });
});
