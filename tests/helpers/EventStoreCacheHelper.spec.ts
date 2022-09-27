import sinon from 'ts-sinon';
import {EventsEnum} from '../../src/Events';
import {EventStoreCacheHelper} from '../../src/helpers/EventStoreCacheHelper';
import {EventStore} from '../../src/models/EventStore';
import {TestUtilsLogger} from '../tools/TestUtilsLogger';
import LRU_TTL from 'lru-ttl-cache';

describe('EventStoreCacheHelper Class', () => {
  describe('findEventById', () => {
    const eventStore = new EventStore({
      type: EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_INITIATED,
      aggregate_id: {},
      data: {},
      sequence_id: 1
    });
    const eventId = '600000000000000000000000';

    afterEach(() => {
      sinon.restore();
    });

    it('success case if does not exist in cache', async () => {
      const findById = sinon.stub(EventStore, 'findById').resolves(eventStore);
      const eventStoreCacheHelper = new EventStoreCacheHelper('1m', 10);

      await eventStoreCacheHelper.findEventById(eventId, TestUtilsLogger.getLogger(sinon.spy()));
      findById.should.have.been.calledOnceWith(eventId);
    });

    it('success case if does not exist in eventstore will read from primary', async () => {
      const eventStoreCacheHelper = new EventStoreCacheHelper('1m', 10);

      await eventStoreCacheHelper.findEventById(eventId, TestUtilsLogger.getLogger(sinon.spy()));
    });

    it('success case if does exist in cache', async () => {
      const has = sinon.stub(LRU_TTL.prototype, 'has').resolves(true);
      const eventStoreCacheHelper = new EventStoreCacheHelper('1m', 10);

      await eventStoreCacheHelper.findEventById(eventId, TestUtilsLogger.getLogger(sinon.spy()));
      has.should.have.been.calledOnceWith(eventId);
    });
  });
});
