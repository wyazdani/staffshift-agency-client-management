import {LoggerContext} from 'a24-logzio-winston';
import {assert} from 'chai';
import {describe} from 'mocha';
import {SinonStub} from 'sinon';
import sinon, {stubInterface} from 'ts-sinon';
import {ConsultantJobProcessAggregate} from '../../../../src/aggregates/ConsultantJobProcess/ConsultantJobProcessAggregate';
import {ConsultantJobProcessRepository} from '../../../../src/aggregates/ConsultantJobProcess/ConsultantJobProcessRepository';
import {ConsultantJobProcessAggregateStatusEnum} from '../../../../src/aggregates/ConsultantJobProcess/types/ConsultantJobProcessAggregateStatusEnum';
import {EventStoreErrorEncoder} from '../../../../src/BulkProcessManager/EventStoreErrorEncoder';
import {ConsultantAssignProcess} from '../../../../src/BulkProcessManager/processes/ConsultantAssignProcess/ConsultantAssignProcess';
import {RetryService, RetryableError, NonRetryableError} from '../../../../src/BulkProcessManager/RetryService';
import {SequenceIdMismatch} from '../../../../src/errors/SequenceIdMismatch';
import {TestUtilsLogger} from '../../../tools/TestUtilsLogger';
import {ValidationError, ResourceNotFoundError} from 'a24-node-error-utils';
import {CommandBus} from '../../../../src/aggregates/CommandBus';

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
  const clientIdB = 'B';
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
      client_ids: [clientId, clientIdB]
    },
    meta_data: metaData
  };
  const aggregateId = {
    name: 'consultant_job_process',
    agency_id: agencyId,
    job_id: initiateEvent.data._id
  };
  const addAgencyClientConsultantAggregateId = {
    name: 'aggregate name',
    agency_id: agencyId,
    client_id: clientId
  };
  const jobAggregateId = {
    name: 'consultant_job',
    agency_id: agencyId
  };

  const opts = {
    maxRetry: 2,
    retryDelay: 1000
  };

  describe('execute()', () => {
    it('Test success scenario both for execute() and complete()', async () => {
      const aggregate = stubInterface<ConsultantJobProcessAggregate>();
      const getAggregate = sinon.stub(ConsultantJobProcessRepository.prototype, 'getAggregate').resolves(aggregate);

      aggregate.getCurrentStatus.returns(ConsultantJobProcessAggregateStatusEnum.NEW);

      const startConsultantJobProcess = sinon.stub(CommandBus.prototype, 'startConsultantJobProcess').resolves();
      const addAgencyClientConsultant = sinon.stub(CommandBus.prototype, 'addAgencyClientConsultant').resolves();
      const succeedItemConsultantJobProcess = sinon
        .stub(CommandBus.prototype, 'succeedItemConsultantJobProcess')
        .resolves();
      const completeConsultantJobProcess = sinon.stub(CommandBus.prototype, 'completeConsultantJobProcess').resolves();
      const completeAssignConsultant = sinon.stub(CommandBus.prototype, 'completeAssignConsultant').resolves();

      aggregate.getProgressedItems.returns([{client_id: clientIdB}]);

      execRetryService.callsFake((func) => func());
      const process = new ConsultantAssignProcess(logger, opts);

      await process.execute(initiateEvent);

      execRetryService.should.have.been.calledOnce;
      getAggregate.should.have.been.calledWith(aggregateId);
      startConsultantJobProcess.should.have.been.calledWith(aggregateId, 2);
      addAgencyClientConsultant.should.have.been.calledOnceWith(
        addAgencyClientConsultantAggregateId,
        initiateEvent.data.consultant_role_id,
        initiateEvent.data.consultant_id
      );
      succeedItemConsultantJobProcess.should.have.been.calledOnceWith(aggregateId, {client_id: clientId});
      completeConsultantJobProcess.should.have.been.calledOnceWith(aggregateId);

      await process.complete();
      completeAssignConsultant.should.have.been.calledWith(jobAggregateId, initiateEvent.data._id);
    });

    it('Test process already completed', async () => {
      const aggregate = stubInterface<ConsultantJobProcessAggregate>();
      const getAggregate = sinon.stub(ConsultantJobProcessRepository.prototype, 'getAggregate').resolves(aggregate);

      aggregate.getCurrentStatus.returns(ConsultantJobProcessAggregateStatusEnum.COMPLETED);

      execRetryService.callsFake((func) => func());
      const process = new ConsultantAssignProcess(logger, opts);

      await process.execute(initiateEvent);

      execRetryService.should.not.have.been.called;
      getAggregate.should.have.been.calledWith(aggregateId);
    });

    it('Test sequence id mismatch error', async () => {
      const aggregate = stubInterface<ConsultantJobProcessAggregate>();
      const getAggregate = sinon.stub(ConsultantJobProcessRepository.prototype, 'getAggregate').resolves(aggregate);

      aggregate.getCurrentStatus.returns(ConsultantJobProcessAggregateStatusEnum.NEW);

      const startConsultantJobProcess = sinon.stub(CommandBus.prototype, 'startConsultantJobProcess').resolves();
      const addAgencyClientConsultant = sinon
        .stub(CommandBus.prototype, 'addAgencyClientConsultant')
        .resolves()
        .rejects(new SequenceIdMismatch('sample'));
      const failItemConsultantJobProcess = sinon.stub(CommandBus.prototype, 'failItemConsultantJobProcess').resolves();
      const completeConsultantJobProcess = sinon.stub(CommandBus.prototype, 'completeConsultantJobProcess').resolves();

      aggregate.getProgressedItems.returns([{client_id: clientIdB}]);

      execRetryService.callsFake((func) => func());
      const process = new ConsultantAssignProcess(logger, opts);

      await process.execute(initiateEvent);

      execRetryService.should.have.been.calledOnce;
      getAggregate.should.have.been.calledWith(aggregateId);
      startConsultantJobProcess.should.have.been.calledWith(aggregateId, 2);
      addAgencyClientConsultant.should.have.been.calledOnceWith(
        addAgencyClientConsultantAggregateId,
        initiateEvent.data.consultant_role_id,
        initiateEvent.data.consultant_id
      );
      failItemConsultantJobProcess.should.have.been.calledWith(aggregateId, {
        client_id: clientId,
        errors: encodedError
      });
      completeConsultantJobProcess.should.have.been.calledOnce;
    });

    it('Test ValidationError', async () => {
      const aggregate = stubInterface<ConsultantJobProcessAggregate>();
      const getAggregate = sinon.stub(ConsultantJobProcessRepository.prototype, 'getAggregate').resolves(aggregate);

      aggregate.getCurrentStatus.returns(ConsultantJobProcessAggregateStatusEnum.NEW);

      const startConsultantJobProcess = sinon.stub(CommandBus.prototype, 'startConsultantJobProcess').resolves();
      const addAgencyClientConsultant = sinon
        .stub(CommandBus.prototype, 'addAgencyClientConsultant')
        .rejects(new ValidationError('sample'));
      const failItemConsultantJobProcess = sinon.stub(CommandBus.prototype, 'failItemConsultantJobProcess').resolves();
      const completeConsultantJobProcess = sinon.stub(CommandBus.prototype, 'completeConsultantJobProcess').resolves();

      aggregate.getProgressedItems.returns([{client_id: clientIdB}]);

      execRetryService.callsFake((func) => {
        assert.throws(() => func(), NonRetryableError);
        throw new Error('sample');
      });
      const process = new ConsultantAssignProcess(logger, opts);

      await process.execute(initiateEvent);

      execRetryService.should.have.been.calledOnce;
      getAggregate.should.have.been.calledWith(aggregateId);
      startConsultantJobProcess.should.have.been.calledWith(aggregateId, 2);
      addAgencyClientConsultant.should.have.been.calledOnceWith(
        addAgencyClientConsultantAggregateId,
        initiateEvent.data.consultant_role_id,
        initiateEvent.data.consultant_id
      );
      failItemConsultantJobProcess.should.have.been.calledWith(aggregateId, {
        client_id: clientId,
        errors: encodedError
      });
      completeConsultantJobProcess.should.have.been.calledOnce;
    });

    it('Test ResourceNotFound', async () => {
      const aggregate = stubInterface<ConsultantJobProcessAggregate>();
      const getAggregate = sinon.stub(ConsultantJobProcessRepository.prototype, 'getAggregate').resolves(aggregate);

      aggregate.getCurrentStatus.returns(ConsultantJobProcessAggregateStatusEnum.NEW);

      const startConsultantJobProcess = sinon.stub(CommandBus.prototype, 'startConsultantJobProcess').resolves();
      const addAgencyClientConsultant = sinon
        .stub(CommandBus.prototype, 'addAgencyClientConsultant')
        .rejects(new ResourceNotFoundError('sample'));
      const failItemConsultantJobProcess = sinon.stub(CommandBus.prototype, 'failItemConsultantJobProcess').resolves();
      const completeConsultantJobProcess = sinon.stub(CommandBus.prototype, 'completeConsultantJobProcess').resolves();

      aggregate.getProgressedItems.returns([{client_id: clientIdB}]);

      execRetryService.callsFake((func) => {
        assert.throws(() => func(), NonRetryableError);
        throw new Error('sample');
      });
      const process = new ConsultantAssignProcess(logger, opts);

      await process.execute(initiateEvent);

      execRetryService.should.have.been.calledOnce;
      getAggregate.should.have.been.calledWith(aggregateId);
      startConsultantJobProcess.should.have.been.calledWith(aggregateId, 2);
      addAgencyClientConsultant.should.have.been.calledOnceWith(
        addAgencyClientConsultantAggregateId,
        initiateEvent.data.consultant_role_id,
        initiateEvent.data.consultant_id
      );
      failItemConsultantJobProcess.should.have.been.calledWith(aggregateId, {
        client_id: clientId,
        errors: encodedError
      });
      completeConsultantJobProcess.should.have.been.calledOnce;
    });

    it('Test unknown error', async () => {
      const aggregate = stubInterface<ConsultantJobProcessAggregate>();
      const getAggregate = sinon.stub(ConsultantJobProcessRepository.prototype, 'getAggregate').resolves(aggregate);

      aggregate.getCurrentStatus.returns(ConsultantJobProcessAggregateStatusEnum.NEW);

      const startConsultantJobProcess = sinon.stub(CommandBus.prototype, 'startConsultantJobProcess').resolves();
      const addAgencyClientConsultant = sinon
        .stub(CommandBus.prototype, 'addAgencyClientConsultant')
        .rejects(new ResourceNotFoundError('sample'));
      const failItemConsultantJobProcess = sinon.stub(CommandBus.prototype, 'failItemConsultantJobProcess').resolves();
      const completeConsultantJobProcess = sinon.stub(CommandBus.prototype, 'completeConsultantJobProcess').resolves();

      aggregate.getProgressedItems.returns([{client_id: clientIdB}]);

      execRetryService.callsFake((func) => {
        assert.throws(() => func(), RetryableError);
        throw new Error('sample');
      });
      const process = new ConsultantAssignProcess(logger, opts);

      await process.execute(initiateEvent);

      execRetryService.should.have.been.calledOnce;
      getAggregate.should.have.been.calledWith(aggregateId);
      startConsultantJobProcess.should.have.been.calledWith(aggregateId, 2);
      addAgencyClientConsultant.should.have.been.calledOnceWith(
        addAgencyClientConsultantAggregateId,
        initiateEvent.data.consultant_role_id,
        initiateEvent.data.consultant_id
      );
      failItemConsultantJobProcess.should.have.been.calledWith(aggregateId, {
        client_id: clientId,
        errors: encodedError
      });
      completeConsultantJobProcess.should.have.been.calledOnce;
    });
  });
});
