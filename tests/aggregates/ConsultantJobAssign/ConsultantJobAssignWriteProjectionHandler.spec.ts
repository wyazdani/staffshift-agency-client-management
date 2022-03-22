import {ConsultantJobAssignWriteProjectionHandler} from '../../../src/aggregates/ConsultantJobAssign/ConsultantJobAssignWriteProjectionHandler';
import {ConsultantJobAssignAggregateStatusEnum} from '../../../src/aggregates/ConsultantJobAssign/types/ConsultantJobAssignAggregateStatusEnum';
import {EventsEnum} from '../../../src/Events';
import {EventStore} from '../../../src/models/EventStore';
import {assert} from 'chai';
import {AgencyConsultantRoleEnabledEventStoreDataInterface} from '../../../src/types/EventStoreDataTypes';

describe('ConsultantJobAssignWriteProjectionHandler', () => {
  describe('execute()', () => {
    const projectionHandler = new ConsultantJobAssignWriteProjectionHandler();

    it('Test CONSULTANT_JOB_ASSIGN_PROCESS_STARTED', () => {
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

      const result = projectionHandler.execute(EventsEnum.CONSULTANT_JOB_ASSIGN_PROCESS_STARTED, aggregate, event);

      result.status.should.equal(ConsultantJobAssignAggregateStatusEnum.STARTED);
      result.last_sequence_id.should.equal(2);
    });

    it('Test CONSULTANT_JOB_ASSIGN_PROCESS_ITEM_SUCCEEDED', () => {
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

      const result = projectionHandler.execute(
        EventsEnum.CONSULTANT_JOB_ASSIGN_PROCESS_ITEM_SUCCEEDED,
        aggregate,
        event
      );

      result.progressed_client_ids.should.deep.equal(['client id']);
      result.last_sequence_id.should.equal(2);
    });
    it('Test CONSULTANT_JOB_ASSIGN_PROCESS_ITEM_FAILED', () => {
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

      const result = projectionHandler.execute(EventsEnum.CONSULTANT_JOB_ASSIGN_PROCESS_ITEM_FAILED, aggregate, event);

      result.progressed_client_ids.should.deep.equal(['client id']);
      result.last_sequence_id.should.equal(2);
    });
    it('Test CONSULTANT_JOB_ASSIGN_PROCESS_COMPLETED', () => {
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

      const result = projectionHandler.execute(EventsEnum.CONSULTANT_JOB_ASSIGN_PROCESS_COMPLETED, aggregate, event);

      result.status.should.equal(ConsultantJobAssignAggregateStatusEnum.COMPLETED);
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
