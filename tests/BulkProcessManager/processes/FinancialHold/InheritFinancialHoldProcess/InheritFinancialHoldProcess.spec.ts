import {ValidationError} from 'a24-node-error-utils';
import sinon, {stubInterface} from 'ts-sinon';
import {AgencyClientAggregate} from '../../../../../src/aggregates/AgencyClient/AgencyClientAggregate';
import {AgencyClientRepository} from '../../../../../src/aggregates/AgencyClient/AgencyClientRepository';
import {ClientInheritanceProcessAggregate} from '../../../../../src/aggregates/ClientInheritanceProcess/ClientInheritanceProcessAggregate';
import {ClientInheritanceProcessRepository} from '../../../../../src/aggregates/ClientInheritanceProcess/ClientInheritanceProcessRepository';
import {ClientInheritanceProcessAggregateStatusEnum} from '../../../../../src/aggregates/ClientInheritanceProcess/types/ClientInheritanceProcessAggregateStatusEnum';
import {CommandBus} from '../../../../../src/aggregates/CommandBus';
import {OrganisationJobCommandEnum} from '../../../../../src/aggregates/OrganisationJob/types';
import {FinancialHoldAggregate} from '../../../../../src/aggregates/FinancialHold/FinancialHoldAggregate';
import {FinancialHoldRepository} from '../../../../../src/aggregates/FinancialHold/FinancialHoldRepository';
import {InheritFinancialHoldProcess} from '../../../../../src/BulkProcessManager/processes/FinancialHold/InheritFinancialHoldProcess/InheritFinancialHoldProcess';
import {CommandBusHelper} from '../../../../../src/BulkProcessManager/processes/FinancialHold/CommandBusHelper';
import {RetryableSetFinancialHold} from '../../../../../src/BulkProcessManager/processes/FinancialHold/RetryableSetFinancialHold';
import {AgencyClientsProjectionV2} from '../../../../../src/models/AgencyClientsProjectionV2';
import {TestUtilsLogger} from '../../../../tools/TestUtilsLogger';

describe('InheritFinancialHoldProcess', () => {
  afterEach(() => {
    sinon.restore();
  });
  const orgId = 'organisation id';
  const jobId = 'job id';
  const agencyId = 'agency id';
  const siteA = 'client site A';
  const wardA = 'client ward A';
  const note = 'oops';

  describe('execute()', () => {
    it('Test success scenario for Site', async () => {
      const clientId = siteA;

      /**
       * we will set this as progressed to make sure we're not going to set financial hold on them
       */
      const wardB = 'client ward B';
      const initiateEvent = {
        _id: 'some id',
        aggregate_id: {
          name: 'aggregate type name',
          agency_id: agencyId,
          organisation_id: orgId
        },
        data: {
          _id: jobId,
          client_id: clientId,
          note
        },
        correlation_id: 'correlation id'
      } as any;
      const process = new InheritFinancialHoldProcess(TestUtilsLogger.getLogger(sinon.spy()), {
        maxRetry: 1,
        retryDelay: 100
      });
      const processAggregate = stubInterface<ClientInheritanceProcessAggregate>();
      const getProcessAggregate = sinon
        .stub(ClientInheritanceProcessRepository.prototype, 'getAggregate')
        .resolves(processAggregate);

      processAggregate.getCurrentStatus.returns(ClientInheritanceProcessAggregateStatusEnum.NEW);
      processAggregate.getProgressedItems.returns([{client_id: wardB}]);
      const agencyClientAggregate = stubInterface<AgencyClientAggregate>();
      const getAgencyClientAggregate = sinon
        .stub(AgencyClientRepository.prototype, 'getAggregate')
        .resolves(agencyClientAggregate);

      agencyClientAggregate.getClientType.returns('site');
      agencyClientAggregate.isLinked.returns(true);
      agencyClientAggregate.getParentClientId.returns('parent id');

      const getEstimatedDescendantCount = sinon
        .stub(AgencyClientsProjectionV2, 'getEstimatedDescendantCount')
        .resolves(2);
      const startProcess = sinon.stub(CommandBusHelper.prototype, 'startProcess').resolves();
      const financialHoldAggregate = stubInterface<FinancialHoldAggregate>();
      const getFinancialHoldAggregate = sinon
        .stub(FinancialHoldRepository.prototype, 'getAggregate')
        .resolves(financialHoldAggregate);

      financialHoldAggregate.getFinancialHold.returns(true);
      const setInheritedFinancialHold = sinon
        .stub(RetryableSetFinancialHold.prototype, 'setInheritedFinancialHold')
        .resolves(true);

      const getAllLinkedWards = sinon.stub(AgencyClientsProjectionV2, 'getAllLinkedWards');

      getAllLinkedWards.resolves([
        {
          client_id: wardA
        },
        {
          client_id: wardB
        }
      ] as any);
      const completeProcess = sinon.stub(CommandBusHelper.prototype, 'completeProcess').resolves();

      await process.execute(initiateEvent);

      getProcessAggregate.should.have.been.calledOnceWith({
        name: 'client_inheritance_process',
        agency_id: agencyId,
        job_id: jobId
      });
      getAgencyClientAggregate.should.have.been.calledOnceWith({
        agency_id: agencyId,
        client_id: clientId
      });
      getEstimatedDescendantCount.should.have.been.calledOnceWith(agencyId, orgId, clientId, 'site');
      startProcess.should.have.been.calledOnceWith(2);
      setInheritedFinancialHold.getCall(0).calledWith(siteA, true, note);
      getAllLinkedWards.should.have.been.calledOnceWith(agencyId, orgId, siteA);
      setInheritedFinancialHold.getCall(1).calledWith(wardA, false, note);
      getFinancialHoldAggregate.should.have.been.calledOnceWith({
        name: 'financial_hold',
        agency_id: agencyId,
        client_id: 'parent id'
      });
      completeProcess.should.have.been.calledOnce;
      setInheritedFinancialHold.should.have.been.calledTwice;
    });

    it('Test success scenario for ward', async () => {
      const clientId = wardA;

      const initiateEvent = {
        _id: 'some id',
        aggregate_id: {
          name: 'aggregate type name',
          agency_id: agencyId,
          organisation_id: orgId
        },
        data: {
          _id: jobId,
          client_id: clientId,
          note
        },
        correlation_id: 'correlation id'
      } as any;
      const process = new InheritFinancialHoldProcess(TestUtilsLogger.getLogger(sinon.spy()), {
        maxRetry: 1,
        retryDelay: 100
      });
      const processAggregate = stubInterface<ClientInheritanceProcessAggregate>();
      const getProcessAggregate = sinon
        .stub(ClientInheritanceProcessRepository.prototype, 'getAggregate')
        .resolves(processAggregate);

      processAggregate.getCurrentStatus.returns(ClientInheritanceProcessAggregateStatusEnum.STARTED);
      processAggregate.getProgressedItems.returns([]);
      const agencyClientAggregate = stubInterface<AgencyClientAggregate>();
      const getAgencyClientAggregate = sinon
        .stub(AgencyClientRepository.prototype, 'getAggregate')
        .resolves(agencyClientAggregate);

      agencyClientAggregate.getClientType.returns('ward');
      agencyClientAggregate.isLinked.returns(true);
      agencyClientAggregate.getParentClientId.returns('parent id');

      const financialHoldAggregate = stubInterface<FinancialHoldAggregate>();
      const getFinancialHoldAggregate = sinon
        .stub(FinancialHoldRepository.prototype, 'getAggregate')
        .resolves(financialHoldAggregate);

      financialHoldAggregate.getFinancialHold.returns(true);
      const setInheritedFinancialHold = sinon
        .stub(RetryableSetFinancialHold.prototype, 'setInheritedFinancialHold')
        .resolves(true);

      const completeProcess = sinon.stub(CommandBusHelper.prototype, 'completeProcess').resolves();

      await process.execute(initiateEvent);

      getProcessAggregate.should.have.been.calledOnceWith({
        name: 'client_inheritance_process',
        agency_id: agencyId,
        job_id: jobId
      });
      getAgencyClientAggregate.should.have.been.calledOnceWith({
        agency_id: agencyId,
        client_id: clientId
      });
      setInheritedFinancialHold.should.have.been.calledOnceWith(wardA, true, 'oops');
      getFinancialHoldAggregate.should.have.been.calledOnceWith({
        name: 'financial_hold',
        agency_id: agencyId,
        client_id: 'parent id'
      });
      completeProcess.should.have.been.calledOnce;
    });

    it('Test when process was already completed', async () => {
      const clientId = wardA;

      const initiateEvent = {
        _id: 'some id',
        aggregate_id: {
          name: 'aggregate type name',
          agency_id: agencyId,
          organisation_id: orgId
        },
        data: {
          _id: jobId,
          client_id: clientId,
          note
        },
        correlation_id: 'correlation id'
      } as any;
      const process = new InheritFinancialHoldProcess(TestUtilsLogger.getLogger(sinon.spy()), {
        maxRetry: 1,
        retryDelay: 100
      });
      const processAggregate = stubInterface<ClientInheritanceProcessAggregate>();
      const getProcessAggregate = sinon
        .stub(ClientInheritanceProcessRepository.prototype, 'getAggregate')
        .resolves(processAggregate);

      processAggregate.getCurrentStatus.returns(ClientInheritanceProcessAggregateStatusEnum.COMPLETED);

      await process.execute(initiateEvent);

      getProcessAggregate.should.have.been.calledOnceWith({
        name: 'client_inheritance_process',
        agency_id: agencyId,
        job_id: jobId
      });
    });

    it('Test client is not linked anymore', async () => {
      const clientId = wardA;

      const initiateEvent = {
        _id: 'some id',
        aggregate_id: {
          name: 'aggregate type name',
          agency_id: agencyId,
          organisation_id: orgId
        },
        data: {
          _id: jobId,
          client_id: clientId,
          note
        },
        correlation_id: 'correlation id'
      } as any;
      const process = new InheritFinancialHoldProcess(TestUtilsLogger.getLogger(sinon.spy()), {
        maxRetry: 1,
        retryDelay: 100
      });
      const processAggregate = stubInterface<ClientInheritanceProcessAggregate>();
      const getProcessAggregate = sinon
        .stub(ClientInheritanceProcessRepository.prototype, 'getAggregate')
        .resolves(processAggregate);

      processAggregate.getCurrentStatus.returns(ClientInheritanceProcessAggregateStatusEnum.STARTED);
      processAggregate.getProgressedItems.returns([]);
      const agencyClientAggregate = stubInterface<AgencyClientAggregate>();
      const getAgencyClientAggregate = sinon
        .stub(AgencyClientRepository.prototype, 'getAggregate')
        .resolves(agencyClientAggregate);

      agencyClientAggregate.getClientType.returns('ward');
      agencyClientAggregate.isLinked.returns(false);

      const completeProcess = sinon.stub(CommandBusHelper.prototype, 'completeProcess').resolves();

      await process.execute(initiateEvent);

      getProcessAggregate.should.have.been.calledOnceWith({
        name: 'client_inheritance_process',
        agency_id: agencyId,
        job_id: jobId
      });
      getAgencyClientAggregate.should.have.been.calledOnceWith({
        agency_id: agencyId,
        client_id: clientId
      });

      completeProcess.should.have.been.calledOnce;
    });

    it('Test client type is organisation we end the process', async () => {
      const clientId = wardA;

      const initiateEvent = {
        _id: 'some id',
        aggregate_id: {
          name: 'aggregate type name',
          agency_id: agencyId,
          organisation_id: orgId
        },
        data: {
          _id: jobId,
          client_id: clientId,
          note
        },
        correlation_id: 'correlation id'
      } as any;
      const process = new InheritFinancialHoldProcess(TestUtilsLogger.getLogger(sinon.spy()), {
        maxRetry: 1,
        retryDelay: 100
      });
      const processAggregate = stubInterface<ClientInheritanceProcessAggregate>();
      const getProcessAggregate = sinon
        .stub(ClientInheritanceProcessRepository.prototype, 'getAggregate')
        .resolves(processAggregate);

      processAggregate.getCurrentStatus.returns(ClientInheritanceProcessAggregateStatusEnum.STARTED);
      processAggregate.getProgressedItems.returns([]);
      const agencyClientAggregate = stubInterface<AgencyClientAggregate>();
      const getAgencyClientAggregate = sinon
        .stub(AgencyClientRepository.prototype, 'getAggregate')
        .resolves(agencyClientAggregate);

      agencyClientAggregate.getClientType.returns('organisation');
      agencyClientAggregate.isLinked.returns(true);

      const completeProcess = sinon.stub(CommandBusHelper.prototype, 'completeProcess').resolves();

      await process.execute(initiateEvent);

      getProcessAggregate.should.have.been.calledOnceWith({
        name: 'client_inheritance_process',
        agency_id: agencyId,
        job_id: jobId
      });
      getAgencyClientAggregate.should.have.been.calledOnceWith({
        agency_id: agencyId,
        client_id: clientId
      });

      completeProcess.should.have.been.calledOnce;
    });

    it('Test if the item is progressed already, we just complete the process', async () => {
      const clientId = wardA;

      const initiateEvent = {
        _id: 'some id',
        aggregate_id: {
          name: 'aggregate type name',
          agency_id: agencyId,
          organisation_id: orgId
        },
        data: {
          _id: jobId,
          client_id: clientId,
          note
        },
        correlation_id: 'correlation id'
      } as any;
      const process = new InheritFinancialHoldProcess(TestUtilsLogger.getLogger(sinon.spy()), {
        maxRetry: 1,
        retryDelay: 100
      });
      const processAggregate = stubInterface<ClientInheritanceProcessAggregate>();
      const getProcessAggregate = sinon
        .stub(ClientInheritanceProcessRepository.prototype, 'getAggregate')
        .resolves(processAggregate);

      processAggregate.getCurrentStatus.returns(ClientInheritanceProcessAggregateStatusEnum.STARTED);
      processAggregate.getProgressedItems.returns([{client_id: wardA}]);
      const agencyClientAggregate = stubInterface<AgencyClientAggregate>();
      const getAgencyClientAggregate = sinon
        .stub(AgencyClientRepository.prototype, 'getAggregate')
        .resolves(agencyClientAggregate);

      agencyClientAggregate.getClientType.returns('ward');
      agencyClientAggregate.isLinked.returns(true);
      agencyClientAggregate.getParentClientId.returns('parent id');

      const financialHoldAggregate = stubInterface<FinancialHoldAggregate>();
      const getFinancialHoldAggregate = sinon
        .stub(FinancialHoldRepository.prototype, 'getAggregate')
        .resolves(financialHoldAggregate);

      financialHoldAggregate.getFinancialHold.returns(true);
      const setInheritedFinancialHold = sinon.stub(RetryableSetFinancialHold.prototype, 'setInheritedFinancialHold');

      const completeProcess = sinon.stub(CommandBusHelper.prototype, 'completeProcess').resolves();

      await process.execute(initiateEvent);

      getProcessAggregate.should.have.been.calledOnceWith({
        name: 'client_inheritance_process',
        agency_id: agencyId,
        job_id: jobId
      });
      getAgencyClientAggregate.should.have.been.calledOnceWith({
        agency_id: agencyId,
        client_id: clientId
      });
      setInheritedFinancialHold.should.not.have.been.called;
      getFinancialHoldAggregate.should.have.been.calledOnceWith({
        name: 'financial_hold',
        agency_id: agencyId,
        client_id: 'parent id'
      });
      completeProcess.should.have.been.calledOnce;
    });

    it('Test if fail to inherit on actual node even after retries, we complete the process', async () => {
      const clientId = wardA;

      const initiateEvent = {
        _id: 'some id',
        aggregate_id: {
          name: 'aggregate type name',
          agency_id: agencyId,
          organisation_id: orgId
        },
        data: {
          _id: jobId,
          client_id: clientId,
          note
        },
        correlation_id: 'correlation id'
      } as any;
      const process = new InheritFinancialHoldProcess(TestUtilsLogger.getLogger(sinon.spy()), {
        maxRetry: 1,
        retryDelay: 100
      });
      const processAggregate = stubInterface<ClientInheritanceProcessAggregate>();
      const getProcessAggregate = sinon
        .stub(ClientInheritanceProcessRepository.prototype, 'getAggregate')
        .resolves(processAggregate);

      processAggregate.getCurrentStatus.returns(ClientInheritanceProcessAggregateStatusEnum.STARTED);
      processAggregate.getProgressedItems.returns([]);
      const agencyClientAggregate = stubInterface<AgencyClientAggregate>();
      const getAgencyClientAggregate = sinon
        .stub(AgencyClientRepository.prototype, 'getAggregate')
        .resolves(agencyClientAggregate);

      agencyClientAggregate.getClientType.returns('ward');
      agencyClientAggregate.isLinked.returns(true);
      agencyClientAggregate.getParentClientId.returns('parent id');

      const financialHoldAggregate = stubInterface<FinancialHoldAggregate>();
      const getFinancialHoldAggregate = sinon
        .stub(FinancialHoldRepository.prototype, 'getAggregate')
        .resolves(financialHoldAggregate);

      financialHoldAggregate.getFinancialHold.returns(true);
      const setInheritedFinancialHold = sinon
        .stub(RetryableSetFinancialHold.prototype, 'setInheritedFinancialHold')
        .resolves(false);

      const completeProcess = sinon.stub(CommandBusHelper.prototype, 'completeProcess').resolves();

      await process.execute(initiateEvent);

      getProcessAggregate.should.have.been.calledOnceWith({
        name: 'client_inheritance_process',
        agency_id: agencyId,
        job_id: jobId
      });
      getAgencyClientAggregate.should.have.been.calledOnceWith({
        agency_id: agencyId,
        client_id: clientId
      });
      setInheritedFinancialHold.should.have.been.calledOnceWith(wardA, true, 'oops');
      getFinancialHoldAggregate.should.have.been.calledOnceWith({
        name: 'financial_hold',
        agency_id: agencyId,
        client_id: 'parent id'
      });
      completeProcess.should.have.been.calledOnce;
    });
  });

  describe('complete()', () => {
    it('Test success scenario', async () => {
      const clientId = wardA;

      const initiateEvent = {
        _id: 'some id',
        aggregate_id: {
          name: 'aggregate type name',
          agency_id: agencyId,
          organisation_id: orgId
        },
        data: {
          _id: jobId,
          client_id: clientId,
          note
        },
        correlation_id: 'correlation id'
      } as any;
      const process = new InheritFinancialHoldProcess(TestUtilsLogger.getLogger(sinon.spy()), {
        maxRetry: 1,
        retryDelay: 100
      });
      const processAggregate = stubInterface<ClientInheritanceProcessAggregate>();

      sinon.stub(ClientInheritanceProcessRepository.prototype, 'getAggregate').resolves(processAggregate);

      processAggregate.getCurrentStatus.returns(ClientInheritanceProcessAggregateStatusEnum.COMPLETED);

      await process.execute(initiateEvent);
      const execute = sinon.stub(CommandBus.prototype, 'execute').resolves();

      await process.complete();
      execute.should.have.been.calledOnceWith({
        aggregateId: initiateEvent.aggregate_id,
        type: OrganisationJobCommandEnum.COMPLETE_INHERIT_FINANCIAL_HOLD,
        data: {_id: initiateEvent.data._id}
      });
    });

    it('Test when job is already completed, resolve the promise', async () => {
      const clientId = wardA;

      const initiateEvent = {
        _id: 'some id',
        aggregate_id: {
          name: 'aggregate type name',
          agency_id: agencyId,
          organisation_id: orgId
        },
        data: {
          _id: jobId,
          client_id: clientId,
          note
        },
        correlation_id: 'correlation id'
      } as any;
      const process = new InheritFinancialHoldProcess(TestUtilsLogger.getLogger(sinon.spy()), {
        maxRetry: 1,
        retryDelay: 100
      });
      const processAggregate = stubInterface<ClientInheritanceProcessAggregate>();

      sinon.stub(ClientInheritanceProcessRepository.prototype, 'getAggregate').resolves(processAggregate);

      processAggregate.getCurrentStatus.returns(ClientInheritanceProcessAggregateStatusEnum.COMPLETED);

      await process.execute(initiateEvent);
      const execute = sinon.stub(CommandBus.prototype, 'execute').rejects(
        new ValidationError('sample').setErrors([
          {
            code: 'JOB_ALREADY_COMPLETED',
            message: 'sample 2'
          }
        ])
      );

      await process.complete();
      execute.should.have.been.calledOnceWith({
        aggregateId: initiateEvent.aggregate_id,
        type: OrganisationJobCommandEnum.COMPLETE_INHERIT_FINANCIAL_HOLD,
        data: {_id: initiateEvent.data._id}
      });
    });

    it('Test command throws unknown error, reject the promise', async () => {
      const clientId = wardA;

      const initiateEvent = {
        _id: 'some id',
        aggregate_id: {
          name: 'aggregate type name',
          agency_id: agencyId,
          organisation_id: orgId
        },
        data: {
          _id: jobId,
          client_id: clientId,
          note
        },
        correlation_id: 'correlation id'
      } as any;
      const process = new InheritFinancialHoldProcess(TestUtilsLogger.getLogger(sinon.spy()), {
        maxRetry: 1,
        retryDelay: 100
      });
      const processAggregate = stubInterface<ClientInheritanceProcessAggregate>();

      sinon.stub(ClientInheritanceProcessRepository.prototype, 'getAggregate').resolves(processAggregate);

      processAggregate.getCurrentStatus.returns(ClientInheritanceProcessAggregateStatusEnum.COMPLETED);

      await process.execute(initiateEvent);
      const err = new Error('sample rejected');
      const execute = sinon.stub(CommandBus.prototype, 'execute').rejects(err);

      await process.complete().should.have.been.rejectedWith(Error, 'sample rejected');
      execute.should.have.been.calledOnceWith({
        aggregateId: initiateEvent.aggregate_id,
        type: OrganisationJobCommandEnum.COMPLETE_INHERIT_FINANCIAL_HOLD,
        data: {_id: initiateEvent.data._id}
      });
    });
  });
});
