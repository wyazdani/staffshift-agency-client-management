import sinon from 'ts-sinon';
import {BulkProcessManagerV1, BulkProcessManagerStatusEnum} from '../../../../src/models/BulkProcessManagerV1';
import {ConsultantJobInitiatedEventHandler} from '../../../../src/projections/BulkProcessManagerV1/event-handlers/ConsultantJobInitiatedEventHandler';
import {TestUtilsLogger} from '../../../tools/TestUtilsLogger';
import {MONGO_ERROR_CODES} from 'staffshift-node-enums';

describe('ConsultantJobInitiatedEventHandler', () => {
  afterEach(() => {
    sinon.restore();
  });
  describe('handle()', () => {
    it('Test success scenario', async () => {
      const event: any = {
        _id: 'event id',
        aggregate_id: {sample: 'ok'},
        data: {
          _id: 'record id'
        }
      };
      const create = sinon.stub(BulkProcessManagerV1, 'create').resolves();
      const handler = new ConsultantJobInitiatedEventHandler(TestUtilsLogger.getLogger(sinon.spy()));

      await handler.handle(event);
      create.should.have.been.calledWith({
        _id: event.data._id,
        aggregate_id: event.aggregate_id,
        status: BulkProcessManagerStatusEnum.NEW,
        initiate_event_id: event._id
      });
    });

    it('Test duplicate key error', async () => {
      const event: any = {
        _id: 'event id',
        aggregate_id: {sample: 'ok'},
        data: {
          _id: 'record id'
        }
      };
      const create = sinon.stub(BulkProcessManagerV1, 'create').rejects({
        code: MONGO_ERROR_CODES.DUPLICATE_KEY
      });
      const handler = new ConsultantJobInitiatedEventHandler(TestUtilsLogger.getLogger(sinon.spy()));

      await handler.handle(event);
      create.should.have.been.calledWith({
        _id: event.data._id,
        aggregate_id: event.aggregate_id,
        status: BulkProcessManagerStatusEnum.NEW,
        initiate_event_id: event._id
      });
    });

    it('Test reject error on internal error', async () => {
      const event: any = {
        _id: 'event id',
        aggregate_id: {sample: 'ok'},
        data: {
          _id: 'record id'
        }
      };
      const error = new Error('oops');
      const create = sinon.stub(BulkProcessManagerV1, 'create').rejects(error);
      const handler = new ConsultantJobInitiatedEventHandler(TestUtilsLogger.getLogger(sinon.spy()));

      await handler.handle(event).should.have.been.rejectedWith(error);
      create.should.have.been.calledWith({
        _id: event.data._id,
        aggregate_id: event.aggregate_id,
        status: BulkProcessManagerStatusEnum.NEW,
        initiate_event_id: event._id
      });
    });
  });
});
