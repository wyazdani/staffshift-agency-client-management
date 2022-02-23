import {ConsultantWriteProjectionHandler} from '../../src/Consultant/ConsultantWriteProjectionHandler';
import {EventsEnum} from '../../src/Events';
import {EventStore} from '../../src/models/EventStore';
import {assert} from 'chai';
import {
  AgencyConsultantRoleEnabledEventStoreDataInterface,
  ConsultantAssignInitiatedEventStoreDataInterface,
  ConsultantAssignCompletedEventStoreDataInterface
} from '../../src/types/EventStoreDataTypes';

describe('ConsultantWriteProjectionHandler', () => {
  describe('execute()', () => {
    const projectionHandler = new ConsultantWriteProjectionHandler();

    describe('CONSULTANT_ASSIGN_INITIATED Event', () => {
      it('Test when processes var is not defined', () => {
        const aggregate: any = {
          last_sequence_id: 1
        };
        const eventData: ConsultantAssignInitiatedEventStoreDataInterface = {
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

        const result = projectionHandler.execute(EventsEnum.CONSULTANT_ASSIGN_INITIATED, aggregate, event);

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
        const eventData: ConsultantAssignInitiatedEventStoreDataInterface = {
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

        const result = projectionHandler.execute(EventsEnum.CONSULTANT_ASSIGN_INITIATED, aggregate, event);

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
        const eventData: ConsultantAssignCompletedEventStoreDataInterface = {
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

        const result = projectionHandler.execute(EventsEnum.CONSULTANT_ASSIGN_COMPLETED, aggregate, event);

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
        const eventData: ConsultantAssignCompletedEventStoreDataInterface = {
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

        const result = projectionHandler.execute(EventsEnum.CONSULTANT_ASSIGN_COMPLETED, aggregate, event);

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
        `Event not supported ${EventsEnum.AGENCY_CLIENT_CONSULTANT_UNASSIGNED}`
      );
    });
  });
});
