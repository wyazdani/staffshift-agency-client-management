import {EventStoreHttpClient} from 'ss-eventstore';
import sinon, {stubInterface} from 'ts-sinon';
import {BulkProcessManager} from '../../src/BulkProcessManager/BulkProcessManager';
import {ProcessFactory} from '../../src/BulkProcessManager/ProcessFactory';
import {ProcessInterface} from '../../src/BulkProcessManager/types/ProcessInterface';
import {BulkProcessManagerV1, BulkProcessManagerStatusEnum} from '../../src/models/BulkProcessManagerV1';
import {TestUtilsLogger} from '../tools/TestUtilsLogger';

describe('BulkProcessManager', () => {
  afterEach(() => {
    sinon.restore();
  });
  describe('start()', () => {
    it('Test starts the process manager', async () => {
      const eventStoreHttpClient = stubInterface<EventStoreHttpClient>();
      const bulkProcessManager = new BulkProcessManager(TestUtilsLogger.getLogger(sinon.spy()), {
        parallel_limit: 2,
        polling_interval: 2,
        heartbeat_expire_limit: 0,
        heartbeat_interval: 0,
        eventStoreHttpClient
      });
      const event: any = {
        type: 'sample-event-type'
      };
      const recordA: any = {
        _id: 'process id',
        initiate_event_id: 'sample event id',
        save: sinon.stub().resolves()
      };
      const error = {name: 'VersionError'};
      const recordB: any = {
        _id: 'process id B',
        initiate_event_id: 'sample event id B',
        save: sinon.stub().rejects(error)
      };
      const bulkRecords = [recordA, recordB];
      const cursor: any = {
        sort: sinon.stub().returnsThis(),
        limit: sinon.stub().returnsThis(),
        exec: sinon.stub().resolves(bulkRecords)
      };

      const findStub = sinon.stub(BulkProcessManagerV1, 'find').returns(cursor);

      eventStoreHttpClient.getEvent.resolves(event);
      const process = stubInterface<ProcessInterface>();

      sinon.stub(ProcessFactory, 'getProcess').returns(process);
      process.execute.resolves();
      await Promise.all([bulkProcessManager.start(), bulkProcessManager.shutdown()]);
      recordA.status.should.equal(BulkProcessManagerStatusEnum.PROCESSING);
      recordB.status.should.equal(BulkProcessManagerStatusEnum.PROCESSING);
      recordA.save.should.have.been.calledOnce;
      recordB.save.should.have.been.calledOnce;
      process.execute.should.have.been.calledOnceWith(event);
      findStub.should.have.been.calledWith({
        status: BulkProcessManagerStatusEnum.NEW
      });
      cursor.sort.should.have.been.calledWith({
        created_at: 1
      });
      cursor.limit.should.have.been.calledWith(2);
    });

    it('Test not throw error in case of error and continue', async () => {
      const eventStoreHttpClient = stubInterface<EventStoreHttpClient>();
      const bulkProcessManager = new BulkProcessManager(TestUtilsLogger.getLogger(sinon.spy()), {
        parallel_limit: 2,
        polling_interval: 2,
        heartbeat_expire_limit: 0,
        heartbeat_interval: 0,
        eventStoreHttpClient
      });
      const event: any = {
        type: 'sample-event-type'
      };
      const recordA: any = {
        _id: 'process id',
        initiate_event_id: 'sample event id',
        save: sinon.stub().resolves()
      };
      const error = new Error('some error');
      const bulkRecords = [recordA];
      const cursor: any = {
        sort: sinon.stub().returnsThis(),
        limit: sinon.stub().returnsThis(),
        exec: sinon.stub().resolves(bulkRecords)
      };

      sinon.stub(BulkProcessManagerV1, 'find').returns(cursor);
      eventStoreHttpClient.getEvent.resolves(event);
      const process = stubInterface<ProcessInterface>();

      sinon.stub(ProcessFactory, 'getProcess').returns(process);
      process.execute.rejects(error);
      await Promise.all([bulkProcessManager.start(), bulkProcessManager.shutdown()]);
      recordA.status.should.equal(BulkProcessManagerStatusEnum.PROCESSING);
      recordA.save.should.have.been.calledOnce;
      process.execute.should.have.been.calledOnceWith(event);
    });

    it('Test not throw error if initiate error not found', async () => {
      const eventStoreHttpClient = stubInterface<EventStoreHttpClient>();
      const bulkProcessManager = new BulkProcessManager(TestUtilsLogger.getLogger(sinon.spy()), {
        parallel_limit: 2,
        polling_interval: 2,
        heartbeat_expire_limit: 0,
        heartbeat_interval: 0,

        eventStoreHttpClient
      });
      const event: any = {
        type: 'sample-event-type'
      };
      const recordA: any = {
        _id: 'process id',
        initiate_event_id: 'sample event id',
        save: sinon.stub().resolves()
      };
      const error = new Error('some error');
      const bulkRecords = [recordA];
      const cursor: any = {
        sort: sinon.stub().returnsThis(),
        limit: sinon.stub().returnsThis(),
        exec: sinon.stub().resolves(bulkRecords)
      };

      sinon.stub(BulkProcessManagerV1, 'find').returns(cursor);
      eventStoreHttpClient.getEvent.resolves(event);
      const process = stubInterface<ProcessInterface>();

      sinon.stub(ProcessFactory, 'getProcess').throws(error);
      await Promise.all([bulkProcessManager.start(), bulkProcessManager.shutdown()]);
      recordA.status.should.equal(BulkProcessManagerStatusEnum.PROCESSING);
      recordA.save.should.have.been.calledOnce;
      process.execute.should.not.have.been.called;
    });

    it('Test continue when not events found', async () => {
      const eventStoreHttpClient = stubInterface<EventStoreHttpClient>();
      const bulkProcessManager = new BulkProcessManager(TestUtilsLogger.getLogger(sinon.spy()), {
        parallel_limit: 2,
        polling_interval: 2,
        heartbeat_expire_limit: 0,
        heartbeat_interval: 0,

        eventStoreHttpClient
      });
      const cursor: any = {
        sort: sinon.stub().returnsThis(),
        limit: sinon.stub().returnsThis(),
        exec: sinon.stub().resolves([])
      };

      sinon.stub(BulkProcessManagerV1, 'find').returns(cursor);
      await Promise.all([bulkProcessManager.start(), bulkProcessManager.shutdown()]);
    });
  });
});
