import sinon from 'ts-sinon';
import {HeartbeatService} from '../../src/BulkProcessManager/HeartbeatService';
import {BulkProcessManagerV1} from '../../src/models/BulkProcessManagerV1';
import {TestUtilsLogger} from '../tools/TestUtilsLogger';

describe('HeartbeatService', () => {
  afterEach(() => {
    sinon.restore();
  });
  describe('start() and stop()', () => {
    it('Test updating heartbeat', async () => {
      const date = new Date();
      const clock = sinon.useFakeTimers(date);
      const logger = TestUtilsLogger.getLogger(sinon.spy());
      const processId = 'process id';
      const updateOne = sinon.stub(BulkProcessManagerV1, 'updateOne').resolves();
      const heartbeat = new HeartbeatService(logger, processId, 5000);

      heartbeat.start();
      await clock.tickAsync(12000);

      heartbeat.stop();
      updateOne.should.have.been.called.calledTwice;
      updateOne.firstCall.should.have.been.calledWith(
        {
          _id: processId
        },
        {
          $set: {
            heart_beat: new Date(date.getTime() + 5000)
          }
        }
      );
      updateOne.secondCall.should.have.been.calledWith(
        {
          _id: processId
        },
        {
          $set: {
            heart_beat: new Date(date.getTime() + 10000)
          }
        }
      );
    });

    it('Test updating heartbeat fails does not throw error', async () => {
      const date = new Date();
      const clock = sinon.useFakeTimers(date);
      const logger = TestUtilsLogger.getLogger(sinon.spy());
      const processId = 'process id';
      const updateOne = sinon.stub(BulkProcessManagerV1, 'updateOne').rejects(new Error('sample'));
      const heartbeat = new HeartbeatService(logger, processId, 5000);

      heartbeat.start();
      await clock.tickAsync(5010);

      heartbeat.stop();
      updateOne.should.have.been.called.calledOnce;
    });
  });
});
