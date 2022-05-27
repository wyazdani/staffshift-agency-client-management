import {ConsultantJobWriteProjectionHandler} from '../../../src/aggregates/ConsultantJob/ConsultantJobWriteProjectionHandler';
import {EventsEnum} from '../../../src/Events';
import {EventStore} from '../../../src/models/EventStore';
import {assert} from 'chai';
import {
  AgencyConsultantRoleEnabledEventStoreDataInterface,
  ConsultantJobAssignInitiatedEventStoreDataInterface,
  ConsultantJobAssignCompletedEventStoreDataInterface,
  ConsultantJobUnassignCompletedEventStoreDataInterface,
  ConsultantJobUnassignInitiatedEventStoreDataInterface,
  ConsultantJobTransferInitiatedEventStoreDataInterface,
  ConsultantJobTransferCompletedEventStoreDataInterface
} from '../../../src/types/EventTypes';

describe('ConsultantJobWriteProjectionHandler', () => {
  describe('execute()', () => {
    const projectionHandler = new ConsultantJobWriteProjectionHandler();

    describe('CONSULTANT_ASSIGN_INITIATED Event', () => {
      it('Test when processes var is not defined', () => {
        const aggregate: any = {
          last_sequence_id: 1
        };
        const eventData: ConsultantJobAssignInitiatedEventStoreDataInterface = {
          client_ids: ['sample client id'],
          _id: 'sample',
          consultant_id: 'consultant id',
          consultant_role_id: 'consultant_role_id'
        };
        const event = new EventStore({
          type: 'sample',
          aggregate_id: {},
          data: eventData,
          sequence_id: 1,
          meta_data: {},
          correlation_id: 1
        });

        const result = projectionHandler.execute(EventsEnum.CONSULTANT_JOB_ASSIGN_INITIATED, aggregate, event);

        result.processes[0].should.deep.equal({
          _id: eventData._id,
          consultants: [eventData.consultant_id],
          status: 'initiated'
        });
      });

      it('Test when processes var is already defined', () => {
        const aggregate: any = {
          last_sequence_id: 1,
          processes: [
            {
              sample: 'ok'
            }
          ]
        };
        const eventData: ConsultantJobAssignInitiatedEventStoreDataInterface = {
          client_ids: ['sample client id'],
          _id: 'sample',
          consultant_id: 'consultant id',
          consultant_role_id: 'consultant_role_id'
        };
        const event = new EventStore({
          type: 'sample',
          aggregate_id: {},
          data: eventData,
          sequence_id: 1,
          meta_data: {},
          correlation_id: 1
        });

        const result = projectionHandler.execute(EventsEnum.CONSULTANT_JOB_ASSIGN_INITIATED, aggregate, event);

        result.processes[0].should.deep.equal({
          sample: 'ok'
        });
        result.processes[1].should.deep.equal({
          _id: eventData._id,
          consultants: [eventData.consultant_id],
          status: 'initiated'
        });
      });
    });

    describe('CONSULTANT_ASSIGN_COMPLETED Event', () => {
      it('Test mark the process completed', () => {
        const aggregate: any = {
          last_sequence_id: 1,
          processes: [
            {
              _id: 'sample',
              status: 'initiated'
            }
          ]
        };
        const eventData: ConsultantJobAssignCompletedEventStoreDataInterface = {
          _id: 'sample'
        };
        const event = new EventStore({
          type: 'sample',
          aggregate_id: {},
          data: eventData,
          sequence_id: 1,
          meta_data: {},
          correlation_id: 1
        });

        const result = projectionHandler.execute(EventsEnum.CONSULTANT_JOB_ASSIGN_COMPLETED, aggregate, event);

        result.processes[0].should.deep.equal({
          _id: eventData._id,
          status: 'completed'
        });
      });

      it('Test do nothing when process not found', () => {
        const aggregate: any = {
          last_sequence_id: 1,
          processes: [
            {
              _id: 'sample-oops',
              status: 'initiated'
            }
          ]
        };
        const eventData: ConsultantJobAssignCompletedEventStoreDataInterface = {
          _id: 'sample'
        };
        const event = new EventStore({
          type: 'sample',
          aggregate_id: {},
          data: eventData,
          sequence_id: 1,
          meta_data: {},
          correlation_id: 1
        });

        const result = projectionHandler.execute(EventsEnum.CONSULTANT_JOB_ASSIGN_COMPLETED, aggregate, event);

        result.processes[0].should.deep.equal({
          _id: 'sample-oops',
          status: 'initiated'
        });
      });
    });

    describe('CONSULTANT_UNASSIGN_INITIATED Event', () => {
      it('Test when processes var is not defined', () => {
        const aggregate: any = {
          last_sequence_id: 1
        };
        const eventData: ConsultantJobUnassignInitiatedEventStoreDataInterface = {
          client_ids: ['sample client id'],
          _id: 'sample',
          consultant_id: 'consultant id',
          consultant_role_id: 'consultant_role_id'
        };
        const event = new EventStore({
          type: 'sample',
          aggregate_id: {},
          data: eventData,
          sequence_id: 1,
          meta_data: {},
          correlation_id: 1
        });

        const result = projectionHandler.execute(EventsEnum.CONSULTANT_JOB_UNASSIGN_INITIATED, aggregate, event);

        result.processes[0].should.deep.equal({
          _id: eventData._id,
          consultants: [eventData.consultant_id],
          status: 'initiated'
        });
      });

      it('Test when processes var is already defined', () => {
        const aggregate: any = {
          last_sequence_id: 1,
          processes: [
            {
              sample: 'ok'
            }
          ]
        };
        const eventData: ConsultantJobUnassignInitiatedEventStoreDataInterface = {
          client_ids: ['sample client id'],
          _id: 'sample',
          consultant_id: 'consultant id',
          consultant_role_id: 'consultant_role_id'
        };
        const event = new EventStore({
          type: 'sample',
          aggregate_id: {},
          data: eventData,
          sequence_id: 1,
          meta_data: {},
          correlation_id: 1
        });

        const result = projectionHandler.execute(EventsEnum.CONSULTANT_JOB_UNASSIGN_INITIATED, aggregate, event);

        result.processes[0].should.deep.equal({
          sample: 'ok'
        });
        result.processes[1].should.deep.equal({
          _id: eventData._id,
          consultants: [eventData.consultant_id],
          status: 'initiated'
        });
      });
    });

    describe('CONSULTANT_UNASSIGN_COMPLETED Event', () => {
      it('Test mark the process completed', () => {
        const aggregate: any = {
          last_sequence_id: 1,
          processes: [
            {
              _id: 'sample',
              status: 'initiated'
            }
          ]
        };
        const eventData: ConsultantJobUnassignCompletedEventStoreDataInterface = {
          _id: 'sample'
        };
        const event = new EventStore({
          type: 'sample',
          aggregate_id: {},
          data: eventData,
          sequence_id: 1,
          meta_data: {},
          correlation_id: 1
        });

        const result = projectionHandler.execute(EventsEnum.CONSULTANT_JOB_UNASSIGN_COMPLETED, aggregate, event);

        result.processes[0].should.deep.equal({
          _id: eventData._id,
          status: 'completed'
        });
      });

      it('Test do nothing when process not found', () => {
        const aggregate: any = {
          last_sequence_id: 1,
          processes: [
            {
              _id: 'sample-oops',
              status: 'initiated'
            }
          ]
        };
        const eventData: ConsultantJobUnassignCompletedEventStoreDataInterface = {
          _id: 'sample'
        };
        const event = new EventStore({
          type: 'sample',
          aggregate_id: {},
          data: eventData,
          sequence_id: 1,
          meta_data: {},
          correlation_id: 1
        });

        const result = projectionHandler.execute(EventsEnum.CONSULTANT_JOB_UNASSIGN_COMPLETED, aggregate, event);

        result.processes[0].should.deep.equal({
          _id: 'sample-oops',
          status: 'initiated'
        });
      });
    });

    describe('CONSULTANT_JOB_TRANSFER_INITIATED Event', () => {
      it('Test when processes var is not defined', () => {
        const aggregate: any = {
          last_sequence_id: 1
        };
        const eventData: ConsultantJobTransferInitiatedEventStoreDataInterface = {
          client_ids: ['sample client id'],
          _id: 'sample',
          from_consultant_id: 'consultant id',
          to_consultant_id: 'consultant id2',
          consultant_role_id: 'consultant_role_id'
        };
        const event = new EventStore({
          type: 'sample',
          aggregate_id: {},
          data: eventData,
          sequence_id: 1,
          meta_data: {},
          correlation_id: 1
        });

        const result = projectionHandler.execute(EventsEnum.CONSULTANT_JOB_TRANSFER_INITIATED, aggregate, event);

        result.processes[0].should.deep.equal({
          _id: eventData._id,
          consultants: [eventData.from_consultant_id, eventData.to_consultant_id],
          status: 'initiated'
        });
      });

      it('Test when processes var is already defined', () => {
        const aggregate: any = {
          last_sequence_id: 1,
          processes: [
            {
              sample: 'ok'
            }
          ]
        };
        const eventData: ConsultantJobTransferInitiatedEventStoreDataInterface = {
          client_ids: ['sample client id'],
          _id: 'sample',
          from_consultant_id: 'consultant id',
          to_consultant_id: 'consultant id 2',
          consultant_role_id: 'consultant_role_id'
        };
        const event = new EventStore({
          type: 'sample',
          aggregate_id: {},
          data: eventData,
          sequence_id: 1,
          meta_data: {},
          correlation_id: 1
        });

        const result = projectionHandler.execute(EventsEnum.CONSULTANT_JOB_TRANSFER_INITIATED, aggregate, event);

        result.processes[0].should.deep.equal({
          sample: 'ok'
        });
        result.processes[1].should.deep.equal({
          _id: eventData._id,
          consultants: [eventData.from_consultant_id, eventData.to_consultant_id],
          status: 'initiated'
        });
      });
    });

    describe('CONSULTANT_TRANSFER_COMPLETED Event', () => {
      it('Test mark the process completed', () => {
        const aggregate: any = {
          last_sequence_id: 1,
          processes: [
            {
              _id: 'sample',
              status: 'initiated'
            }
          ]
        };
        const eventData: ConsultantJobTransferCompletedEventStoreDataInterface = {
          _id: 'sample'
        };
        const event = new EventStore({
          type: 'sample',
          aggregate_id: {},
          data: eventData,
          sequence_id: 1,
          meta_data: {},
          correlation_id: 1
        });

        const result = projectionHandler.execute(EventsEnum.CONSULTANT_JOB_TRANSFER_COMPLETED, aggregate, event);

        result.processes[0].should.deep.equal({
          _id: eventData._id,
          status: 'completed'
        });
      });

      it('Test do nothing when process not found', () => {
        const aggregate: any = {
          last_sequence_id: 1,
          processes: [
            {
              _id: 'sample-oops',
              status: 'initiated'
            }
          ]
        };
        const eventData: ConsultantJobTransferCompletedEventStoreDataInterface = {
          _id: 'sample'
        };
        const event = new EventStore({
          type: 'sample',
          aggregate_id: {},
          data: eventData,
          sequence_id: 1,
          meta_data: {},
          correlation_id: 1
        });

        const result = projectionHandler.execute(EventsEnum.CONSULTANT_JOB_TRANSFER_COMPLETED, aggregate, event);

        result.processes[0].should.deep.equal({
          _id: 'sample-oops',
          status: 'initiated'
        });
      });
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
