import {LoggerContext} from 'a24-logzio-winston';
import {assert} from 'chai';
import {describe} from 'mocha';
import {ObjectId} from 'mongodb';
import {SinonStub} from 'sinon';
import sinon, {stubInterface} from 'ts-sinon';
import {ConsultantJobProcessAggregate} from '../../../../src/aggregates/ConsultantJobProcess/ConsultantJobProcessAggregate';
import {ConsultantJobProcessRepository} from '../../../../src/aggregates/ConsultantJobProcess/ConsultantJobProcessRepository';
import {ConsultantJobProcessAggregateStatusEnum} from '../../../../src/aggregates/ConsultantJobProcess/types/ConsultantJobProcessAggregateStatusEnum';
import {EventStoreErrorEncoder} from '../../../../src/BulkProcessManager/EventStoreErrorEncoder';
import {ClientConsultantAssignments} from '../../../../src/BulkProcessManager/processes/ConsultantUnassignProcess/ClientConsultantAssignments';
import {ConsultantUnassignProcess} from '../../../../src/BulkProcessManager/processes/ConsultantUnassignProcess/ConsultantUnassignProcess';
import {RetryService, RetryableError, NonRetryableError} from '../../../../src/BulkProcessManager/RetryService';
import {SequenceIdMismatch} from '../../../../src/errors/SequenceIdMismatch';
import {TestUtilsLogger} from '../../../tools/TestUtilsLogger';
import {ValidationError, ResourceNotFoundError} from 'a24-node-error-utils';
import {CommandBus} from '../../../../src/aggregates/CommandBus';

describe('ConsultantUnassignProcess', () => {
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
  const consultantRoleId = 'consultant role id';
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
      const clientAssignments = stubInterface<ClientConsultantAssignments>();
      const createInstance = sinon.stub(ClientConsultantAssignments, 'createInstance').returns(clientAssignments);
      const startConsultantJobProcess = sinon.stub(CommandBus.prototype, 'startConsultantJobProcess').resolves();
      const removeAgencyClientConsultant = sinon.stub(CommandBus.prototype, 'removeAgencyClientConsultant').resolves();
      const succeedItemConsultantJobProcess = sinon
        .stub(CommandBus.prototype, 'succeedItemConsultantJobProcess')
        .resolves();
      const completeConsultantJobProcess = sinon.stub(CommandBus.prototype, 'completeConsultantJobProcess').resolves();
      const completeUnassignConsultant = sinon.stub(CommandBus.prototype, 'completeUnassignConsultant').resolves();

      aggregate.getProgressedItems.returns([{client_id: clientIdB, consultant_role_id: consultantRoleId}]);

      execRetryService.callsFake((func) => func());
      clientAssignments.getEstimatedCount.resolves(2);
      const assignmentId = new ObjectId();

      clientAssignments.getClientConsultantAssignments.resolves([
        {
          _id: assignmentId,
          client_id: clientId,
          consultant_role_id: consultantRoleId
        },
        {
          _id: new ObjectId(),
          client_id: clientIdB,
          consultant_role_id: consultantRoleId
        }
      ]);
      const process = new ConsultantUnassignProcess(logger, opts);

      await process.execute(initiateEvent);

      execRetryService.should.have.been.calledOnce;
      getAggregate.should.have.been.calledOnceWith(aggregateId);
      startConsultantJobProcess.should.have.been.calledOnceWith(aggregateId, 2);
      removeAgencyClientConsultant.should.have.been.calledOnceWith(
        {
          agency_id: agencyId,
          client_id: clientId
        },
        assignmentId.toString()
      );
      succeedItemConsultantJobProcess.should.have.been.calledOnceWith(aggregateId, {
        client_id: clientId,
        consultant_role_id: consultantRoleId
      });
      completeConsultantJobProcess.should.have.been.calledOnceWith(aggregateId);

      await process.complete();
      completeUnassignConsultant.should.have.been.calledOnceWith(jobAggregateId, initiateEvent.data._id);
      clientAssignments.getClientConsultantAssignments.should.have.been.calledOnce;
      clientAssignments.getEstimatedCount.should.have.been.calledOnce;
      createInstance.should.have.been.calledOnceWith(initiateEvent);
    });

    it('Test when the process is already completed', async () => {
      const aggregate = stubInterface<ConsultantJobProcessAggregate>();
      const getAggregate = sinon.stub(ConsultantJobProcessRepository.prototype, 'getAggregate').resolves(aggregate);

      aggregate.getCurrentStatus.returns(ConsultantJobProcessAggregateStatusEnum.COMPLETED);
      const clientAssignments = stubInterface<ClientConsultantAssignments>();
      const createInstance = sinon.stub(ClientConsultantAssignments, 'createInstance').returns(clientAssignments);

      const process = new ConsultantUnassignProcess(logger, opts);

      await process.execute(initiateEvent);

      execRetryService.should.not.have.been.called;
      getAggregate.should.have.been.calledOnceWith(aggregateId);
      createInstance.should.have.been.calledOnceWith(initiateEvent);
    });

    it('Test count SequenceIdMismatch as RetryableError', async () => {
      const aggregate = stubInterface<ConsultantJobProcessAggregate>();
      const getAggregate = sinon.stub(ConsultantJobProcessRepository.prototype, 'getAggregate').resolves(aggregate);

      aggregate.getCurrentStatus.returns(ConsultantJobProcessAggregateStatusEnum.NEW);
      const clientAssignments = stubInterface<ClientConsultantAssignments>();
      const createInstance = sinon.stub(ClientConsultantAssignments, 'createInstance').returns(clientAssignments);
      const startConsultantJobProcess = sinon.stub(CommandBus.prototype, 'startConsultantJobProcess').resolves();
      const removeAgencyClientConsultant = sinon
        .stub(CommandBus.prototype, 'removeAgencyClientConsultant')
        .rejects(new SequenceIdMismatch('sample'));
      const failItemConsultantJobProcess = sinon.stub(CommandBus.prototype, 'failItemConsultantJobProcess').resolves();
      const completeConsultantJobProcess = sinon.stub(CommandBus.prototype, 'completeConsultantJobProcess').resolves();

      aggregate.getProgressedItems.returns([{client_id: clientIdB, consultant_role_id: consultantRoleId}]);

      execRetryService.callsFake((func) => {
        try {
          func();
          assert.fail('It should not happen');
        } catch (error) {
          error.should.be.instanceOf(RetryableError);
          throw error;
        }
      });
      clientAssignments.getEstimatedCount.resolves(2);
      const assignmentId = new ObjectId();

      clientAssignments.getClientConsultantAssignments.resolves([
        {
          _id: assignmentId,
          client_id: clientId,
          consultant_role_id: consultantRoleId
        },
        {
          _id: new ObjectId(),
          client_id: clientIdB,
          consultant_role_id: consultantRoleId
        }
      ]);
      const process = new ConsultantUnassignProcess(logger, opts);

      await process.execute(initiateEvent);

      execRetryService.should.have.been.calledOnce;
      getAggregate.should.have.been.calledOnceWith(aggregateId);
      startConsultantJobProcess.should.have.been.calledOnceWith(aggregateId, 2);
      removeAgencyClientConsultant.should.have.been.calledOnceWith(
        {
          agency_id: agencyId,
          client_id: clientId
        },
        assignmentId.toString()
      );
      failItemConsultantJobProcess.should.have.been.calledOnceWith(aggregateId, {
        client_id: clientId,
        consultant_role_id: consultantRoleId,
        errors: encodedError
      });
      completeConsultantJobProcess.should.have.been.calledOnceWith(aggregateId);
      createInstance.should.have.been.calledOnceWith(initiateEvent);
      clientAssignments.getClientConsultantAssignments.should.have.been.calledOnce;
      clientAssignments.getEstimatedCount.should.have.been.calledOnce;
    });

    it('Test count ResourceNotFoundError as NonRetryableError', async () => {
      const aggregate = stubInterface<ConsultantJobProcessAggregate>();
      const getAggregate = sinon.stub(ConsultantJobProcessRepository.prototype, 'getAggregate').resolves(aggregate);

      aggregate.getCurrentStatus.returns(ConsultantJobProcessAggregateStatusEnum.NEW);
      const clientAssignments = stubInterface<ClientConsultantAssignments>();
      const createInstance = sinon.stub(ClientConsultantAssignments, 'createInstance').returns(clientAssignments);
      const startConsultantJobProcess = sinon.stub(CommandBus.prototype, 'startConsultantJobProcess').resolves();
      const removeAgencyClientConsultant = sinon
        .stub(CommandBus.prototype, 'removeAgencyClientConsultant')
        .rejects(new ResourceNotFoundError('sample'));
      const failItemConsultantJobProcess = sinon.stub(CommandBus.prototype, 'failItemConsultantJobProcess').resolves();
      const completeConsultantJobProcess = sinon.stub(CommandBus.prototype, 'completeConsultantJobProcess').resolves();

      aggregate.getProgressedItems.returns([{client_id: clientIdB, consultant_role_id: consultantRoleId}]);

      execRetryService.callsFake((func) => {
        try {
          func();
          assert.fail('It should not happen');
        } catch (error) {
          error.should.be.instanceOf(NonRetryableError);
          throw error;
        }
      });
      clientAssignments.getEstimatedCount.resolves(2);
      const assignmentId = new ObjectId();

      clientAssignments.getClientConsultantAssignments.resolves([
        {
          _id: assignmentId,
          client_id: clientId,
          consultant_role_id: consultantRoleId
        },
        {
          _id: new ObjectId(),
          client_id: clientIdB,
          consultant_role_id: consultantRoleId
        }
      ]);
      const process = new ConsultantUnassignProcess(logger, opts);

      await process.execute(initiateEvent);

      execRetryService.should.have.been.calledOnce;
      getAggregate.should.have.been.calledOnceWith(aggregateId);
      startConsultantJobProcess.should.have.been.calledOnceWith(aggregateId, 2);
      removeAgencyClientConsultant.should.have.been.calledOnceWith(
        {
          agency_id: agencyId,
          client_id: clientId
        },
        assignmentId.toString()
      );
      failItemConsultantJobProcess.should.have.been.calledOnceWith(aggregateId, {
        client_id: clientId,
        consultant_role_id: consultantRoleId,
        errors: encodedError
      });
      completeConsultantJobProcess.should.have.been.calledOnceWith(aggregateId);
      createInstance.should.have.been.calledOnceWith(initiateEvent);
      clientAssignments.getClientConsultantAssignments.should.have.been.calledOnce;
      clientAssignments.getEstimatedCount.should.have.been.calledOnce;
    });

    it('Test count ValidationError as NonRetryableError', async () => {
      const aggregate = stubInterface<ConsultantJobProcessAggregate>();
      const getAggregate = sinon.stub(ConsultantJobProcessRepository.prototype, 'getAggregate').resolves(aggregate);

      aggregate.getCurrentStatus.returns(ConsultantJobProcessAggregateStatusEnum.NEW);
      const clientAssignments = stubInterface<ClientConsultantAssignments>();
      const createInstance = sinon.stub(ClientConsultantAssignments, 'createInstance').returns(clientAssignments);
      const startConsultantJobProcess = sinon.stub(CommandBus.prototype, 'startConsultantJobProcess').resolves();
      const removeAgencyClientConsultant = sinon
        .stub(CommandBus.prototype, 'removeAgencyClientConsultant')
        .rejects(new ValidationError('sample'));
      const failItemConsultantJobProcess = sinon.stub(CommandBus.prototype, 'failItemConsultantJobProcess').resolves();
      const completeConsultantJobProcess = sinon.stub(CommandBus.prototype, 'completeConsultantJobProcess').resolves();

      aggregate.getProgressedItems.returns([{client_id: clientIdB, consultant_role_id: consultantRoleId}]);

      execRetryService.callsFake((func) => {
        try {
          func();
          assert.fail('It should not happen');
        } catch (error) {
          error.should.be.instanceOf(NonRetryableError);
          throw error;
        }
      });
      clientAssignments.getEstimatedCount.resolves(2);
      const assignmentId = new ObjectId();

      clientAssignments.getClientConsultantAssignments.resolves([
        {
          _id: assignmentId,
          client_id: clientId,
          consultant_role_id: consultantRoleId
        },
        {
          _id: new ObjectId(),
          client_id: clientIdB,
          consultant_role_id: consultantRoleId
        }
      ]);
      const process = new ConsultantUnassignProcess(logger, opts);

      await process.execute(initiateEvent);

      execRetryService.should.have.been.calledOnce;
      getAggregate.should.have.been.calledOnceWith(aggregateId);
      startConsultantJobProcess.should.have.been.calledOnceWith(aggregateId, 2);
      removeAgencyClientConsultant.should.have.been.calledOnceWith(
        {
          agency_id: agencyId,
          client_id: clientId
        },
        assignmentId.toString()
      );
      failItemConsultantJobProcess.should.have.been.calledOnceWith(aggregateId, {
        client_id: clientId,
        consultant_role_id: consultantRoleId,
        errors: encodedError
      });
      completeConsultantJobProcess.should.have.been.calledOnceWith(aggregateId);
      createInstance.should.have.been.calledOnceWith(initiateEvent);
      clientAssignments.getClientConsultantAssignments.should.have.been.calledOnce;
      clientAssignments.getEstimatedCount.should.have.been.calledOnce;
    });

    it('Test count any unknown error as RetryableError', async () => {
      const aggregate = stubInterface<ConsultantJobProcessAggregate>();
      const getAggregate = sinon.stub(ConsultantJobProcessRepository.prototype, 'getAggregate').resolves(aggregate);

      aggregate.getCurrentStatus.returns(ConsultantJobProcessAggregateStatusEnum.NEW);
      const clientAssignments = stubInterface<ClientConsultantAssignments>();
      const createInstance = sinon.stub(ClientConsultantAssignments, 'createInstance').returns(clientAssignments);
      const startConsultantJobProcess = sinon.stub(CommandBus.prototype, 'startConsultantJobProcess').resolves();
      const removeAgencyClientConsultant = sinon
        .stub(CommandBus.prototype, 'removeAgencyClientConsultant')
        .rejects(new ValidationError('sample'));
      const failItemConsultantJobProcess = sinon.stub(CommandBus.prototype, 'failItemConsultantJobProcess').resolves();
      const completeConsultantJobProcess = sinon.stub(CommandBus.prototype, 'completeConsultantJobProcess').resolves();

      aggregate.getProgressedItems.returns([{client_id: clientIdB, consultant_role_id: consultantRoleId}]);

      execRetryService.callsFake((func) => {
        try {
          func();
          assert.fail('It should not happen');
        } catch (error) {
          error.should.be.instanceOf(RetryableError);
          throw error;
        }
      });
      clientAssignments.getEstimatedCount.resolves(2);
      const assignmentId = new ObjectId();

      clientAssignments.getClientConsultantAssignments.resolves([
        {
          _id: assignmentId,
          client_id: clientId,
          consultant_role_id: consultantRoleId
        },
        {
          _id: new ObjectId(),
          client_id: clientIdB,
          consultant_role_id: consultantRoleId
        }
      ]);
      const process = new ConsultantUnassignProcess(logger, opts);

      await process.execute(initiateEvent);

      execRetryService.should.have.been.calledOnce;
      getAggregate.should.have.been.calledOnceWith(aggregateId);
      startConsultantJobProcess.should.have.been.calledOnceWith(aggregateId, 2);
      removeAgencyClientConsultant.should.have.been.calledOnceWith(
        {
          agency_id: agencyId,
          client_id: clientId
        },
        assignmentId.toString()
      );
      failItemConsultantJobProcess.should.have.been.calledOnceWith(aggregateId, {
        client_id: clientId,
        consultant_role_id: consultantRoleId,
        errors: encodedError
      });
      completeConsultantJobProcess.should.have.been.calledOnceWith(aggregateId);
      createInstance.should.have.been.calledOnceWith(initiateEvent);
      clientAssignments.getClientConsultantAssignments.should.have.been.calledOnce;
      clientAssignments.getEstimatedCount.should.have.been.calledOnce;
    });
  });
});
