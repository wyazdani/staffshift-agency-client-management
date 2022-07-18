import {ClientInheritanceProcessWriteProjectionHandler} from '../../../src/aggregates/ClientInheritanceProcess/ClientInheritanceProcessWriteProjectionHandler';
import {ClientInheritanceProcessAggregateStatusEnum} from '../../../src/aggregates/ClientInheritanceProcess/types/ClientInheritanceProcessAggregateStatusEnum';
import {EventsEnum} from '../../../src/Events';
import {EventStore} from '../../../src/models/EventStore';
import {assert} from 'chai';

describe('ClientInheritanceProcessWriteProjectionHandler', () => {
  describe('execute()', () => {
    const projectionHandler = new ClientInheritanceProcessWriteProjectionHandler();

    it('Test CLIENT_INHERITANCE_PROCESS_STARTED', () => {
      const aggregate: any = {
        last_sequence_id: 1
      };
      const eventData = {};
      const event = new EventStore({
        type: EventsEnum.AGENCY_CLIENT_INHERITANCE_PROCESS_STARTED,
        aggregate_id: {},
        data: eventData,
        sequence_id: 2,
        meta_data: {
          user_id: 'fake_user'
        },
        correlation_id: 'fake_id'
      });

      const result = projectionHandler.execute(EventsEnum.AGENCY_CLIENT_INHERITANCE_PROCESS_STARTED, aggregate, event);

      result.status.should.equal(ClientInheritanceProcessAggregateStatusEnum.STARTED);
      result.last_sequence_id.should.equal(2);
    });

    it('Test CLIENT_INHERITANCE_PROCESS_ITEM_SUCCEEDED', () => {
      const aggregate: any = {
        last_sequence_id: 1
      };
      const eventData = {
        client_id: 'client id'
      };
      const event = new EventStore({
        type: EventsEnum.AGENCY_CLIENT_INHERITANCE_PROCESS_ITEM_SUCCEEDED,
        aggregate_id: {},
        data: eventData,
        sequence_id: 2,
        meta_data: {
          user_id: 'fake_user'
        },
        correlation_id: 'fake_id'
      });

      const result = projectionHandler.execute(EventsEnum.AGENCY_CLIENT_INHERITANCE_PROCESS_ITEM_SUCCEEDED, aggregate, event);

      result.progressed_items.should.deep.equal([{client_id: 'client id'}]);
      result.last_sequence_id.should.equal(2);
    });
    it('Test CLIENT_INHERITANCE_PROCESS_ITEM_FAILED', () => {
      const aggregate: any = {
        last_sequence_id: 1
      };
      const eventData = {
        client_id: 'client id'
      };
      const event = new EventStore({
        type: EventsEnum.AGENCY_CLIENT_INHERITANCE_PROCESS_ITEM_FAILED,
        aggregate_id: {},
        data: eventData,
        sequence_id: 2,
        meta_data: {
          user_id: 'fake_user'
        },
        correlation_id: 'fake_id'
      });

      const result = projectionHandler.execute(EventsEnum.AGENCY_CLIENT_INHERITANCE_PROCESS_ITEM_FAILED, aggregate, event);

      result.progressed_items.should.deep.equal([{client_id: 'client id'}]);
      result.last_sequence_id.should.equal(2);
    });
    it('Test CLIENT_INHERITANCE_PROCESS_COMPLETED', () => {
      const aggregate: any = {
        last_sequence_id: 1
      };
      const eventData = {};
      const event = new EventStore({
        type: EventsEnum.AGENCY_CLIENT_INHERITANCE_PROCESS_COMPLETED,
        aggregate_id: {},
        data: eventData,
        sequence_id: 2,
        meta_data: {
          user_id: 'fake_user'
        },
        correlation_id: 'fake_id'
      });

      const result = projectionHandler.execute(EventsEnum.AGENCY_CLIENT_INHERITANCE_PROCESS_COMPLETED, aggregate, event);

      result.status.should.equal(ClientInheritanceProcessAggregateStatusEnum.COMPLETED);
      result.last_sequence_id.should.equal(2);
    });
    it('Test throw error when event not found', () => {
      const aggregate: any = {
        last_sequence_id: 1
      };
      const eventData = {
        _id: 'oops'
      };
      const event = new EventStore({
        type: EventsEnum.AGENCY_CLIENT_CONSULTANT_UNASSIGNED,
        aggregate_id: {},
        data: eventData,
        sequence_id: 1,
        meta_data: {
          user_id: 'fake_user'
        },
        correlation_id: 'fake_id'
      });

      assert.throw(
        () => projectionHandler.execute(EventsEnum.AGENCY_CLIENT_CONSULTANT_UNASSIGNED, aggregate, event),
        Error,
        `Event type not supported: ${EventsEnum.AGENCY_CLIENT_CONSULTANT_UNASSIGNED}`
      );
    });
  });
});
