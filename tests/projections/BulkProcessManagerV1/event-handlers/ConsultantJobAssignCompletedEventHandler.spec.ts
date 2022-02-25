import sinon from 'ts-sinon';
import {BulkProcessManagerV1, BulkProcessManagerStatusEnum} from '../../../../src/models/BulkProcessManagerV1';
import {ConsultantJobAssignCompletedEventHandler} from '../../../../src/projections/BulkProcessManagerV1/event-handlers/ConsultantJobAssignCompletedEventHandler';
import {TestUtilsLogger} from '../../../tools/TestUtilsLogger';

describe('ConsultantJobAssignCompletedEventHandler', () => {
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
      const handler = new ConsultantJobAssignCompletedEventHandler(TestUtilsLogger.getLogger(sinon.spy()));

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
