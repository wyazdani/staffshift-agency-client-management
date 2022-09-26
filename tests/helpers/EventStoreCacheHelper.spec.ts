import sinon from 'ts-sinon';
import {EventsEnum} from '../../src/Events';
import {EventStoreCacheHelper} from '../../src/helpers/EventStoreCacheHelper';
import {EventStore} from '../../src/models/EventStore';
import {TestUtilsLogger} from '../tools/TestUtilsLogger';

describe('EventStoreCacheHelper Class', () => {
  describe('findEventById', () => {
    it('success case', async () => {
      const eventStore = new EventStore({
        type: EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_INITIATED,
        aggregate_id: {},
        data: {},
        sequence_id: 1
      });
      const save = sinon.stub(EventStore, 'findById').resolves(eventStore);

      const eventStoreCacheHelper = new EventStoreCacheHelper('1m');

      await eventStoreCacheHelper.findEventById('test', TestUtilsLogger.getLogger(sinon.spy()));
      save.should.have.been.calledOnceWith();
    });
  });
});
