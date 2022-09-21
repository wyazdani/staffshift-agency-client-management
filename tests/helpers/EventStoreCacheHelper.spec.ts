import {assert} from 'chai';
import {ObjectId} from 'mongodb';
import {stringify} from 'querystring';
import sinon from 'ts-sinon';
import {EventsEnum} from '../../src/Events';
import {EventStoreCacheHelper} from '../../src/helpers/EventStoreCacheHelper';
import {EventStore, EventStoreModelInterface} from '../../src/models/EventStore';

describe('EventStoreCacheHelper Class', () => {
  describe('findEventById', () => {
    it('success case', async () => {
      const eventStore = new EventStore({
        type: EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_INITIATED,
        aggregate_id: {},
        data: {},
        sequence_id: 1,
        meta_data: {
          user_id: 'test'
        },
        correlation_id: '123'
      });

      //const eventStoreCacheHelper = new EventStoreCacheHelper();

      //await eventStoreCacheHelper.findEventById(stringify(eventStore._id), 100);
    });
  });
});
