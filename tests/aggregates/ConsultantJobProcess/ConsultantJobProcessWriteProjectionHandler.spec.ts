import {ConsultantJobProcessWriteProjectionHandler} from '../../../src/aggregates/ConsultantJobProcess/ConsultantJobProcessWriteProjectionHandler';
import {ConsultantJobProcessAggregateStatusEnum} from '../../../src/aggregates/ConsultantJobProcess/types/ConsultantJobProcessAggregateStatusEnum';
import {EventsEnum} from '../../../src/Events';
import {EventStore} from '../../../src/models/EventStore';
import {assert} from 'chai';
import {AgencyConsultantRoleEnabledEventStoreDataInterface} from '../../../src/types/EventTypes';

describe('ConsultantJobProcessWriteProjectionHandler', () => {
  describe('execute()', () => {
    const projectionHandler = new ConsultantJobProcessWriteProjectionHandler();

    it('Test CONSULTANT_JOB_PROCESS_STARTED', () => {
      const aggregate: any = {
        last_sequence_id: 1
      };
      const eventData = {};
      const event = new EventStore({
        type: 'sample',
        aggregate_id: {},
        data: eventData,
        sequence_id: 2,
        meta_data: {},
        correlation_id: 1
      });

      const result = projectionHandler.execute(EventsEnum.CONSULTANT_JOB_PROCESS_STARTED, aggregate, event);

      result.status.should.equal(ConsultantJobProcessAggregateStatusEnum.STARTED);
      result.last_sequence_id.should.equal(2);
    });

    it('Test CONSULTANT_JOB_PROCESS_ITEM_SUCCEEDED', () => {
      const aggregate: any = {
        last_sequence_id: 1
      };
      const eventData = {
        client_id: 'client id'
      };
      const event = new EventStore({
        type: 'sample',
        aggregate_id: {},
        data: eventData,
        sequence_id: 2,
        meta_data: {},
        correlation_id: 1
      });

      const result = projectionHandler.execute(EventsEnum.CONSULTANT_JOB_PROCESS_ITEM_SUCCEEDED, aggregate, event);

      result.progressed_items.should.deep.equal([{client_id: 'client id'}]);
      result.last_sequence_id.should.equal(2);
    });
    it('Test CONSULTANT_JOB_PROCESS_ITEM_FAILED', () => {
      const aggregate: any = {
        last_sequence_id: 1
      };
      const eventData = {
        client_id: 'client id'
      };
      const event = new EventStore({
        type: 'sample',
        aggregate_id: {},
        data: eventData,
        sequence_id: 2,
        meta_data: {},
        correlation_id: 1
      });

      const result = projectionHandler.execute(EventsEnum.CONSULTANT_JOB_PROCESS_ITEM_FAILED, aggregate, event);

      result.progressed_items.should.deep.equal([{client_id: 'client id'}]);
      result.last_sequence_id.should.equal(2);
    });
    it('Test CONSULTANT_JOB_PROCESS_COMPLETED', () => {
      const aggregate: any = {
        last_sequence_id: 1
      };
      const eventData = {};
      const event = new EventStore({
        type: 'sample',
        aggregate_id: {},
        data: eventData,
        sequence_id: 2,
        meta_data: {},
        correlation_id: 1
      });

      const result = projectionHandler.execute(EventsEnum.CONSULTANT_JOB_PROCESS_COMPLETED, aggregate, event);

      result.status.should.equal(ConsultantJobProcessAggregateStatusEnum.COMPLETED);
      result.last_sequence_id.should.equal(2);
    });
    it('Test throw error when event not found', () => {
      const aggregate: any = {
        last_sequence_id: 1
      };
      const eventData: AgencyConsultantRoleEnabledEventStoreDataInterface = {
        _id: 'oops'
      };
      const event = new EventStore({
        type: 'sample',
        aggregate_id: {},
        data: eventData,
        sequence_id: 1,
        meta_data: {},
        correlation_id: 1
      });

      assert.throw(
        () => projectionHandler.execute(EventsEnum.AGENCY_CLIENT_CONSULTANT_UNASSIGNED, aggregate, event),
        Error,
        `Event type not supported: ${EventsEnum.AGENCY_CLIENT_CONSULTANT_UNASSIGNED}`
      );
    });
  });
});
