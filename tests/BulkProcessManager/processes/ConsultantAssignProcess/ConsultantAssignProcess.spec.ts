import {LoggerContext} from 'a24-logzio-winston';
import {assert} from 'chai';
import {describe} from 'mocha';
import {SinonStub} from 'sinon';
import sinon, {stubInterface} from 'ts-sinon';
import {ConsultantJobAssignAggregate} from '../../../../src/aggregates/ConsultantJobAssign/ConsultantJobAssignAggregate';
import {ConsultantJobAssignRepository} from '../../../../src/aggregates/ConsultantJobAssign/ConsultantJobAssignRepository';
import {ConsultantJobAssignAggregateStatusEnum} from '../../../../src/aggregates/ConsultantJobAssign/types/ConsultantJobAssignAggregateStatusEnum';
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
    name: 'consultant_job_assign',
    agency_id: agencyId,
    job_id: initiateEvent.data._id
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
      const aggregate = stubInterface<ConsultantJobAssignAggregate>();
      const getAggregate = sinon.stub(ConsultantJobAssignRepository.prototype, 'getAggregate').resolves(aggregate);

      aggregate.getCurrentStatus.returns(ConsultantJobAssignAggregateStatusEnum.NEW);

      const startConsultantJobAssign = sinon.stub(CommandBus.prototype, 'startConsultantJobAssign').resolves();
      const addAgencyClientConsultant = sinon.stub(CommandBus.prototype, 'addAgencyClientConsultant').resolves();
      const succeedItemConsultantJobAssign = sinon
        .stub(CommandBus.prototype, 'succeedItemConsultantJobAssign')
        .resolves();
      const completeConsultantJobAssign = sinon.stub(CommandBus.prototype, 'completeConsultantJobAssign').resolves();
      const completeAssignConsultant = sinon.stub(CommandBus.prototype, 'completeAssignConsultant').resolves();

      aggregate.getProgressedClientIds.returns([clientIdB]);

      execRetryService.callsFake((func) => func());
      const process = new ConsultantAssignProcess(logger, opts);

      await process.execute(initiateEvent);

      execRetryService.should.have.been.calledOnce;
      getAggregate.should.have.been.calledWith(aggregateId);
      startConsultantJobAssign.should.have.been.calledWith(aggregateId);
      addAgencyClientConsultant.should.have.been.calledOnceWith(
        {
          agency_id: agencyId,
          client_id: clientId
        },
        initiateEvent.data.consultant_role_id,
        initiateEvent.data.consultant_id
      );
      succeedItemConsultantJobAssign.should.have.been.calledOnceWith(aggregateId, clientId);
      completeConsultantJobAssign.should.have.been.calledOnceWith(aggregateId);

      await process.complete();
      completeAssignConsultant.should.have.been.calledWith(jobAggregateId, initiateEvent.data._id);
    });

    it('Test process already completed', async () => {
      const aggregate = stubInterface<ConsultantJobAssignAggregate>();
      const getAggregate = sinon.stub(ConsultantJobAssignRepository.prototype, 'getAggregate').resolves(aggregate);

      aggregate.getCurrentStatus.returns(ConsultantJobAssignAggregateStatusEnum.COMPLETED);

      execRetryService.callsFake((func) => func());
      const process = new ConsultantAssignProcess(logger, opts);

      await process.execute(initiateEvent);

      execRetryService.should.not.have.been.called;
      getAggregate.should.have.been.calledWith(aggregateId);
    });

    it('Test sequence id mismatch error', async () => {
      const aggregate = stubInterface<ConsultantJobAssignAggregate>();
      const getAggregate = sinon.stub(ConsultantJobAssignRepository.prototype, 'getAggregate').resolves(aggregate);

      aggregate.getCurrentStatus.returns(ConsultantJobAssignAggregateStatusEnum.NEW);

      const startConsultantJobAssign = sinon.stub(CommandBus.prototype, 'startConsultantJobAssign').resolves();
      const addAgencyClientConsultant = sinon
        .stub(CommandBus.prototype, 'addAgencyClientConsultant')
        .resolves()
        .rejects(new SequenceIdMismatch('sample'));
      const failItemConsultantJobAssign = sinon.stub(CommandBus.prototype, 'failItemConsultantJobAssign').resolves();
      const completeConsultantJobAssign = sinon.stub(CommandBus.prototype, 'completeConsultantJobAssign').resolves();

      aggregate.getProgressedClientIds.returns([clientIdB]);

      execRetryService.callsFake((func) => func());
      const process = new ConsultantAssignProcess(logger, opts);

      await process.execute(initiateEvent);

      execRetryService.should.have.been.calledOnce;
      getAggregate.should.have.been.calledWith(aggregateId);
      startConsultantJobAssign.should.have.been.calledWith(aggregateId);
      addAgencyClientConsultant.should.have.been.calledOnceWith(
        {
          agency_id: agencyId,
          client_id: clientId
        },
        initiateEvent.data.consultant_role_id,
        initiateEvent.data.consultant_id
      );
      failItemConsultantJobAssign.should.have.been.calledWith(aggregateId, {
        client_id: clientId,
        errors: encodedError
      });
      completeConsultantJobAssign.should.have.been.calledOnce;
    });

    it('Test ValidationError', async () => {
      const aggregate = stubInterface<ConsultantJobAssignAggregate>();
      const getAggregate = sinon.stub(ConsultantJobAssignRepository.prototype, 'getAggregate').resolves(aggregate);

      aggregate.getCurrentStatus.returns(ConsultantJobAssignAggregateStatusEnum.NEW);

      const startConsultantJobAssign = sinon.stub(CommandBus.prototype, 'startConsultantJobAssign').resolves();
      const addAgencyClientConsultant = sinon
        .stub(CommandBus.prototype, 'addAgencyClientConsultant')
        .rejects(new ValidationError('sample'));
      const failItemConsultantJobAssign = sinon.stub(CommandBus.prototype, 'failItemConsultantJobAssign').resolves();
      const completeConsultantJobAssign = sinon.stub(CommandBus.prototype, 'completeConsultantJobAssign').resolves();

      aggregate.getProgressedClientIds.returns([clientIdB]);

      execRetryService.callsFake((func) => {
        assert.throws(() => func(), NonRetryableError);
        throw new Error('sample');
      });
      const process = new ConsultantAssignProcess(logger, opts);

      await process.execute(initiateEvent);

      execRetryService.should.have.been.calledOnce;
      getAggregate.should.have.been.calledWith(aggregateId);
      startConsultantJobAssign.should.have.been.calledWith(aggregateId);
      addAgencyClientConsultant.should.have.been.calledOnceWith(
        {
          agency_id: agencyId,
          client_id: clientId
        },
        initiateEvent.data.consultant_role_id,
        initiateEvent.data.consultant_id
      );
      failItemConsultantJobAssign.should.have.been.calledWith(aggregateId, {
        client_id: clientId,
        errors: encodedError
      });
      completeConsultantJobAssign.should.have.been.calledOnce;
    });

    it('Test ResourceNotFound', async () => {
      const aggregate = stubInterface<ConsultantJobAssignAggregate>();
      const getAggregate = sinon.stub(ConsultantJobAssignRepository.prototype, 'getAggregate').resolves(aggregate);

      aggregate.getCurrentStatus.returns(ConsultantJobAssignAggregateStatusEnum.NEW);

      const startConsultantJobAssign = sinon.stub(CommandBus.prototype, 'startConsultantJobAssign').resolves();
      const addAgencyClientConsultant = sinon
        .stub(CommandBus.prototype, 'addAgencyClientConsultant')
        .rejects(new ResourceNotFoundError('sample'));
      const failItemConsultantJobAssign = sinon.stub(CommandBus.prototype, 'failItemConsultantJobAssign').resolves();
      const completeConsultantJobAssign = sinon.stub(CommandBus.prototype, 'completeConsultantJobAssign').resolves();

      aggregate.getProgressedClientIds.returns([clientIdB]);

      execRetryService.callsFake((func) => {
        assert.throws(() => func(), NonRetryableError);
        throw new Error('sample');
      });
      const process = new ConsultantAssignProcess(logger, opts);

      await process.execute(initiateEvent);

      execRetryService.should.have.been.calledOnce;
      getAggregate.should.have.been.calledWith(aggregateId);
      startConsultantJobAssign.should.have.been.calledWith(aggregateId);
      addAgencyClientConsultant.should.have.been.calledOnceWith(
        {
          agency_id: agencyId,
          client_id: clientId
        },
        initiateEvent.data.consultant_role_id,
        initiateEvent.data.consultant_id
      );
      failItemConsultantJobAssign.should.have.been.calledWith(aggregateId, {
        client_id: clientId,
        errors: encodedError
      });
      completeConsultantJobAssign.should.have.been.calledOnce;
    });

    it('Test unknown error', async () => {
      const aggregate = stubInterface<ConsultantJobAssignAggregate>();
      const getAggregate = sinon.stub(ConsultantJobAssignRepository.prototype, 'getAggregate').resolves(aggregate);

      aggregate.getCurrentStatus.returns(ConsultantJobAssignAggregateStatusEnum.NEW);

      const startConsultantJobAssign = sinon.stub(CommandBus.prototype, 'startConsultantJobAssign').resolves();
      const addAgencyClientConsultant = sinon
        .stub(CommandBus.prototype, 'addAgencyClientConsultant')
        .rejects(new ResourceNotFoundError('sample'));
      const failItemConsultantJobAssign = sinon.stub(CommandBus.prototype, 'failItemConsultantJobAssign').resolves();
      const completeConsultantJobAssign = sinon.stub(CommandBus.prototype, 'completeConsultantJobAssign').resolves();

      aggregate.getProgressedClientIds.returns([clientIdB]);

      execRetryService.callsFake((func) => {
        assert.throws(() => func(), RetryableError);
        throw new Error('sample');
      });
      const process = new ConsultantAssignProcess(logger, opts);

      await process.execute(initiateEvent);

      execRetryService.should.have.been.calledOnce;
      getAggregate.should.have.been.calledWith(aggregateId);
      startConsultantJobAssign.should.have.been.calledWith(aggregateId);
      addAgencyClientConsultant.should.have.been.calledOnceWith(
        {
          agency_id: agencyId,
          client_id: clientId
        },
        initiateEvent.data.consultant_role_id,
        initiateEvent.data.consultant_id
      );
      failItemConsultantJobAssign.should.have.been.calledWith(aggregateId, {
        client_id: clientId,
        errors: encodedError
      });
      completeConsultantJobAssign.should.have.been.calledOnce;
    });
  });
});
