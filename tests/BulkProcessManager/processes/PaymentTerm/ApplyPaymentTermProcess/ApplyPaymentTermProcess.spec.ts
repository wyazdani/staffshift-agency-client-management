import {ValidationError} from 'a24-node-error-utils';
import sinon, {stubInterface} from 'ts-sinon';
import {AgencyClientAggregate} from '../../../../../src/aggregates/AgencyClient/AgencyClientAggregate';
import {AgencyClientRepository} from '../../../../../src/aggregates/AgencyClient/AgencyClientRepository';
import {ClientInheritanceProcessAggregate} from '../../../../../src/aggregates/ClientInheritanceProcess/ClientInheritanceProcessAggregate';
import {ClientInheritanceProcessRepository} from '../../../../../src/aggregates/ClientInheritanceProcess/ClientInheritanceProcessRepository';
import {ClientInheritanceProcessAggregateStatusEnum} from '../../../../../src/aggregates/ClientInheritanceProcess/types/ClientInheritanceProcessAggregateStatusEnum';
import {CommandBus} from '../../../../../src/aggregates/CommandBus';
import {OrganisationJobCommandEnum} from '../../../../../src/aggregates/OrganisationJob/types';
import {ApplyPaymentTermProcess} from '../../../../../src/BulkProcessManager/processes/PaymentTerm/ApplyPaymentTermProcess/ApplyPaymentTermProcess';
import {CommandBusHelper} from '../../../../../src/BulkProcessManager/processes/PaymentTerm/CommandBusHelper';
import {RetryableApplyPaymentTerm} from '../../../../../src/BulkProcessManager/processes/PaymentTerm/RetryableApplyPaymentTerm';
import {AgencyClientsProjectionV2} from '../../../../../src/models/AgencyClientsProjectionV2';
import {TestUtilsLogger} from '../../../../tools/TestUtilsLogger';

describe('ApplyPaymentTermProcess', () => {
  afterEach(() => {
    sinon.restore();
  });
  const orgId = 'organisation id';
  const jobId = 'job id';
  const term = 'credit';
  const agencyId = 'agency id';
  const siteA = 'client site A';
  const wardA = 'client ward A';

  describe('execute()', () => {
    it('Test success scenario for Organisation', async () => {
      const clientId = orgId;

      /**
       * we will set this site and ward as progressed to make sure we're not going to set pay term on them
       * but we should go the children still
       */
      const siteB = 'client site B';
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
          term
        },
        correlation_id: 'correlation id'
      } as any;
      const process = new ApplyPaymentTermProcess(TestUtilsLogger.getLogger(sinon.spy()), {
        maxRetry: 1,
        retryDelay: 100
      });
      const processAggregate = stubInterface<ClientInheritanceProcessAggregate>();
      const getProcessAggregate = sinon
        .stub(ClientInheritanceProcessRepository.prototype, 'getAggregate')
        .resolves(processAggregate);

      processAggregate.getCurrentStatus.returns(ClientInheritanceProcessAggregateStatusEnum.NEW);
      processAggregate.getProgressedItems.returns([{client_id: wardB}, {client_id: siteB}]);
      const agencyClientAggregate = stubInterface<AgencyClientAggregate>();
      const getAgencyClientAggregate = sinon
        .stub(AgencyClientRepository.prototype, 'getAggregate')
        .resolves(agencyClientAggregate);

      agencyClientAggregate.getClientType.returns('organisation');
      agencyClientAggregate.isLinked.returns(true);

      const getEstimatedDescendantCount = sinon
        .stub(AgencyClientsProjectionV2, 'getEstimatedDescendantCount')
        .resolves(2);
      const startProcess = sinon.stub(CommandBusHelper.prototype, 'startProcess').resolves();

      const applyPaymentTerm = sinon.stub(RetryableApplyPaymentTerm.prototype, 'applyPaymentTerm').resolves(true);
      const sites = [
        {
          client_id: siteA
        },
        {
          client_id: siteB
        }
      ];
      const getAllLinkedSites = sinon.stub(AgencyClientsProjectionV2, 'getAllLinkedSites').resolves(sites as any);
      const applyInheritedPaymentTerm = sinon
        .stub(RetryableApplyPaymentTerm.prototype, 'applyInheritedPaymentTerm')
        .resolves(true);

      const getAllLinkedWards = sinon.stub(AgencyClientsProjectionV2, 'getAllLinkedWards');

      getAllLinkedWards.onFirstCall().resolves([
        {
          client_id: wardA
        },
        {
          client_id: wardB
        }
      ] as any);
      getAllLinkedWards.onSecondCall().resolves([]);
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
      getEstimatedDescendantCount.should.have.been.calledOnceWith(agencyId, orgId, clientId, 'organisation');
      startProcess.should.have.been.calledOnceWith(2);
      applyPaymentTerm.should.have.been.calledOnceWith(clientId, term);
      getAllLinkedSites.should.have.been.calledOnceWith(agencyId, orgId);
      applyInheritedPaymentTerm.getCall(0).calledWith(siteA, term, false);
      getAllLinkedWards.getCall(0).calledWith(agencyId, orgId, siteA);
      getAllLinkedWards.getCall(1).calledWith(agencyId, orgId, siteB);
      applyInheritedPaymentTerm.getCall(1).calledWith(wardA, term, false);
      completeProcess.should.have.been.calledOnce;
      applyInheritedPaymentTerm.should.have.been.calledTwice;
      getAllLinkedWards.should.have.been.calledTwice;
    });

    it('Test success scenario for Site', async () => {
      const clientId = siteA;

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
          term
        },
        correlation_id: 'correlation id'
      } as any;
      const process = new ApplyPaymentTermProcess(TestUtilsLogger.getLogger(sinon.spy()), {
        maxRetry: 1,
        retryDelay: 100
      });
      const processAggregate = stubInterface<ClientInheritanceProcessAggregate>();
      const getProcessAggregate = sinon
        .stub(ClientInheritanceProcessRepository.prototype, 'getAggregate')
        .resolves(processAggregate);

      processAggregate.getCurrentStatus.returns(ClientInheritanceProcessAggregateStatusEnum.NEW);
      processAggregate.getProgressedItems.returns([]);
      const agencyClientAggregate = stubInterface<AgencyClientAggregate>();
      const getAgencyClientAggregate = sinon
        .stub(AgencyClientRepository.prototype, 'getAggregate')
        .resolves(agencyClientAggregate);

      agencyClientAggregate.getClientType.returns('site');
      agencyClientAggregate.isLinked.returns(true);

      const getEstimatedDescendantCount = sinon
        .stub(AgencyClientsProjectionV2, 'getEstimatedDescendantCount')
        .resolves(2);
      const startProcess = sinon.stub(CommandBusHelper.prototype, 'startProcess').resolves();

      const applyPaymentTerm = sinon.stub(RetryableApplyPaymentTerm.prototype, 'applyPaymentTerm').resolves(true);

      const applyInheritedPaymentTerm = sinon
        .stub(RetryableApplyPaymentTerm.prototype, 'applyInheritedPaymentTerm')
        .resolves(true);

      const getAllLinkedWards = sinon.stub(AgencyClientsProjectionV2, 'getAllLinkedWards').resolves([
        {
          client_id: wardA
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
      applyPaymentTerm.should.have.been.calledOnceWith(clientId, term);
      applyInheritedPaymentTerm.should.have.been.calledOnceWith(wardA, term, false);
      getAllLinkedWards.should.have.been.calledOnceWith(agencyId, orgId, siteA);
      completeProcess.should.have.been.calledOnce;
    });

    it('Test success scenario for Ward', async () => {
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
          term
        },
        correlation_id: 'correlation id'
      } as any;
      const process = new ApplyPaymentTermProcess(TestUtilsLogger.getLogger(sinon.spy()), {
        maxRetry: 1,
        retryDelay: 100
      });
      const processAggregate = stubInterface<ClientInheritanceProcessAggregate>();
      const getProcessAggregate = sinon
        .stub(ClientInheritanceProcessRepository.prototype, 'getAggregate')
        .resolves(processAggregate);

      processAggregate.getCurrentStatus.returns(ClientInheritanceProcessAggregateStatusEnum.NEW);
      processAggregate.getProgressedItems.returns([]);
      const agencyClientAggregate = stubInterface<AgencyClientAggregate>();
      const getAgencyClientAggregate = sinon
        .stub(AgencyClientRepository.prototype, 'getAggregate')
        .resolves(agencyClientAggregate);

      agencyClientAggregate.getClientType.returns('ward');
      agencyClientAggregate.isLinked.returns(true);

      const getEstimatedDescendantCount = sinon
        .stub(AgencyClientsProjectionV2, 'getEstimatedDescendantCount')
        .resolves(2);
      const startProcess = sinon.stub(CommandBusHelper.prototype, 'startProcess').resolves();

      const applyPaymentTerm = sinon.stub(RetryableApplyPaymentTerm.prototype, 'applyPaymentTerm').resolves(true);
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
      getEstimatedDescendantCount.should.have.been.calledOnceWith(agencyId, orgId, clientId, 'ward');
      startProcess.should.have.been.calledOnceWith(2);
      applyPaymentTerm.should.have.been.calledOnceWith(clientId, term);
      completeProcess.should.have.been.calledOnce;
    });

    it('Test when the process is in completed state already', async () => {
      const clientId = orgId;

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
          term
        },
        correlation_id: 'correlation id'
      } as any;
      const process = new ApplyPaymentTermProcess(TestUtilsLogger.getLogger(sinon.spy()), {
        maxRetry: 1,
        retryDelay: 100
      });
      const processAggregate = stubInterface<ClientInheritanceProcessAggregate>();
      const getProcessAggregate = sinon
        .stub(ClientInheritanceProcessRepository.prototype, 'getAggregate')
        .resolves(processAggregate);

      processAggregate.getCurrentStatus.returns(ClientInheritanceProcessAggregateStatusEnum.COMPLETED);

      const agencyClientAggregate = stubInterface<AgencyClientAggregate>();
      const getAgencyClientAggregate = sinon
        .stub(AgencyClientRepository.prototype, 'getAggregate')
        .resolves(agencyClientAggregate);

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
    });

    it('Test when the client is not linked to agency anymore', async () => {
      const clientId = orgId;
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
          term
        },
        correlation_id: 'correlation id'
      } as any;
      const process = new ApplyPaymentTermProcess(TestUtilsLogger.getLogger(sinon.spy()), {
        maxRetry: 1,
        retryDelay: 100
      });
      const processAggregate = stubInterface<ClientInheritanceProcessAggregate>();
      const getProcessAggregate = sinon
        .stub(ClientInheritanceProcessRepository.prototype, 'getAggregate')
        .resolves(processAggregate);

      processAggregate.getCurrentStatus.returns(ClientInheritanceProcessAggregateStatusEnum.STARTED);
      const agencyClientAggregate = stubInterface<AgencyClientAggregate>();
      const getAgencyClientAggregate = sinon
        .stub(AgencyClientRepository.prototype, 'getAggregate')
        .resolves(agencyClientAggregate);

      agencyClientAggregate.getClientType.returns('organisation');
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

    it('Test if failure on applying pay term on the root node we complete the process and not continue', async () => {
      const clientId = siteA;

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
          term
        },
        correlation_id: 'correlation id'
      } as any;
      const process = new ApplyPaymentTermProcess(TestUtilsLogger.getLogger(sinon.spy()), {
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

      agencyClientAggregate.getClientType.returns('site');
      agencyClientAggregate.isLinked.returns(true);

      const applyPaymentTerm = sinon.stub(RetryableApplyPaymentTerm.prototype, 'applyPaymentTerm').resolves(false);

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
      applyPaymentTerm.should.have.been.calledOnceWith(clientId, term);
      completeProcess.should.have.been.calledOnce;
    });

    it('Test when a child is not inherited, we do not apply inherited to the node and children', async () => {
      const clientId = orgId;
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
          term
        },
        correlation_id: 'correlation id'
      } as any;
      const process = new ApplyPaymentTermProcess(TestUtilsLogger.getLogger(sinon.spy()), {
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

      const applyPaymentTerm = sinon.stub(RetryableApplyPaymentTerm.prototype, 'applyPaymentTerm').resolves(true);
      const sites = [
        {
          client_id: siteA
        }
      ];
      const getAllLinkedSites = sinon.stub(AgencyClientsProjectionV2, 'getAllLinkedSites').resolves(sites as any);
      const applyInheritedPaymentTerm = sinon
        .stub(RetryableApplyPaymentTerm.prototype, 'applyInheritedPaymentTerm')
        .resolves(false); //here we say the site is not inherited

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
      applyPaymentTerm.should.have.been.calledOnceWith(clientId, term);
      getAllLinkedSites.should.have.been.calledOnceWith(agencyId, orgId);
      applyInheritedPaymentTerm.should.have.been.calledOnceWith(siteA, term, false);
      completeProcess.should.have.been.calledOnce;
    });
  });

  describe('complete()', () => {
    it('Test success scenario', async () => {
      const initiateEvent = {
        _id: 'some id',
        aggregate_id: {
          name: 'aggregate type name',
          agency_id: agencyId,
          organisation_id: orgId
        },
        data: {
          _id: jobId,
          client_id: orgId,
          term
        },
        correlation_id: 'correlation id'
      } as any;
      const process = new ApplyPaymentTermProcess(TestUtilsLogger.getLogger(sinon.spy()), {
        maxRetry: 1,
        retryDelay: 100
      });
      const processAggregate = stubInterface<ClientInheritanceProcessAggregate>();

      sinon.stub(ClientInheritanceProcessRepository.prototype, 'getAggregate').resolves(processAggregate);

      processAggregate.getCurrentStatus.returns(ClientInheritanceProcessAggregateStatusEnum.COMPLETED);

      const agencyClientAggregate = stubInterface<AgencyClientAggregate>();

      sinon.stub(AgencyClientRepository.prototype, 'getAggregate').resolves(agencyClientAggregate);

      await process.execute(initiateEvent);
      const execute = sinon.stub(CommandBus.prototype, 'execute').resolves();

      await process.complete();
      execute.should.have.been.calledOnceWith({
        aggregateId: initiateEvent.aggregate_id,
        type: OrganisationJobCommandEnum.COMPLETE_APPLY_PAYMENT_TERM,
        data: {_id: initiateEvent.data._id}
      });
    });

    it('Test when already completed error, resolve promise', async () => {
      const initiateEvent = {
        _id: 'some id',
        aggregate_id: {
          name: 'aggregate type name',
          agency_id: agencyId,
          organisation_id: orgId
        },
        data: {
          _id: jobId,
          client_id: orgId,
          term
        },
        correlation_id: 'correlation id'
      } as any;
      const process = new ApplyPaymentTermProcess(TestUtilsLogger.getLogger(sinon.spy()), {
        maxRetry: 1,
        retryDelay: 100
      });
      const processAggregate = stubInterface<ClientInheritanceProcessAggregate>();

      sinon.stub(ClientInheritanceProcessRepository.prototype, 'getAggregate').resolves(processAggregate);

      processAggregate.getCurrentStatus.returns(ClientInheritanceProcessAggregateStatusEnum.COMPLETED);

      const agencyClientAggregate = stubInterface<AgencyClientAggregate>();

      sinon.stub(AgencyClientRepository.prototype, 'getAggregate').resolves(agencyClientAggregate);

      await process.execute(initiateEvent);
      const execute = sinon.stub(CommandBus.prototype, 'execute').rejects(
        new ValidationError('sample').setErrors([
          {
            code: 'JOB_ALREADY_COMPLETED',
            message: 'ok'
          }
        ])
      );

      await process.complete();
      execute.should.have.been.calledOnceWith({
        aggregateId: initiateEvent.aggregate_id,
        type: OrganisationJobCommandEnum.COMPLETE_APPLY_PAYMENT_TERM,
        data: {_id: initiateEvent.data._id}
      });
    });

    it('Test when unknown error, reject promise', async () => {
      const initiateEvent = {
        _id: 'some id',
        aggregate_id: {
          name: 'aggregate type name',
          agency_id: agencyId,
          organisation_id: orgId
        },
        data: {
          _id: jobId,
          client_id: orgId,
          term
        },
        correlation_id: 'correlation id'
      } as any;
      const process = new ApplyPaymentTermProcess(TestUtilsLogger.getLogger(sinon.spy()), {
        maxRetry: 1,
        retryDelay: 100
      });
      const processAggregate = stubInterface<ClientInheritanceProcessAggregate>();

      sinon.stub(ClientInheritanceProcessRepository.prototype, 'getAggregate').resolves(processAggregate);

      processAggregate.getCurrentStatus.returns(ClientInheritanceProcessAggregateStatusEnum.COMPLETED);

      const agencyClientAggregate = stubInterface<AgencyClientAggregate>();

      sinon.stub(AgencyClientRepository.prototype, 'getAggregate').resolves(agencyClientAggregate);

      await process.execute(initiateEvent);
      const error = new Error('oops');
      const execute = sinon.stub(CommandBus.prototype, 'execute').rejects(error);

      await process.complete().should.have.been.rejectedWith(error);
      execute.should.have.been.calledOnceWith({
        aggregateId: initiateEvent.aggregate_id,
        type: OrganisationJobCommandEnum.COMPLETE_APPLY_PAYMENT_TERM,
        data: {_id: initiateEvent.data._id}
      });
    });
  });
});
