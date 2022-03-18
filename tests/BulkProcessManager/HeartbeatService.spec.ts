import * as mockdate from 'mockdate';
import sinon from 'ts-sinon';
import {HeartbeatService} from '../../src/BulkProcessManager/HeartbeatService';
import {BulkProcessManagerV1} from '../../src/models/BulkProcessManagerV1';
import {TestUtilsLogger} from '../tools/TestUtilsLogger';
import {setTimeout} from 'timers/promises';

describe('HeartbeatService', () => {
  afterEach(() => {
    sinon.restore();
    mockdate.reset();
  });
  describe('start() and stop()', () => {
    it('Test updating heartbeat', async () => {
      const date = new Date();

      mockdate.set(date);
      const logger = TestUtilsLogger.getLogger(sinon.spy());
      const processId = 'process id';
      const updateOne = sinon.stub(BulkProcessManagerV1, 'updateOne').resolves();
      const heartbeat = new HeartbeatService(logger, processId, 50);

      heartbeat.start();
      await setTimeout(120);
      heartbeat.stop();
      updateOne.should.have.been.called.calledTwice;
      updateOne.should.have.been.calledWith(
        {
          _id: processId
        },
        {
          $set: {
            heart_beat: date
          }
        }
      );
    });

    it('Test updating heartbeat fails does not throw error', async () => {
      const logger = TestUtilsLogger.getLogger(sinon.spy());
      const processId = 'process id';
      const updateOne = sinon.stub(BulkProcessManagerV1, 'updateOne').rejects(new Error('sample'));
      const heartbeat = new HeartbeatService(logger, processId, 50);

      heartbeat.start();
      await setTimeout(60);
      heartbeat.stop();
      updateOne.should.have.been.called.calledOnce;
    });
  });
});
