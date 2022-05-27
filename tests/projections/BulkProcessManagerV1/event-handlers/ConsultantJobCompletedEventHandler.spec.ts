import sinon from 'ts-sinon';
import {BulkProcessManagerV1, BulkProcessManagerStatusEnum} from '../../../../src/models/BulkProcessManagerV1';
import {ConsultantJobCompletedEventHandler} from '../../../../src/projections/BulkProcessManagerV1/event-handlers/ConsultantJobCompletedEventHandler';
import {TestUtilsLogger} from '../../../tools/TestUtilsLogger';

describe('ConsultantJobCompletedEventHandler', () => {
  afterEach(() => {
    sinon.restore();
  });
  describe('handle()', () => {
    it('Test updating projection', async () => {
      const event: any = {
        data: {
          _id: 'some id'
        }
      };
      const updateOne = sinon.stub(BulkProcessManagerV1, 'updateOne').resolves();
      const handler = new ConsultantJobCompletedEventHandler(TestUtilsLogger.getLogger(sinon.spy()));

      await handler.handle(event);
      updateOne.should.have.been.calledWith(
        {
          _id: event.data._id
        },
        {
          $set: {
            status: BulkProcessManagerStatusEnum.COMPLETED
          }
        }
      );
    });
  });
});
