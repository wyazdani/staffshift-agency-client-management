import {AgencyClientWriteProjectionHandler} from '../../src/AgencyClient/AgencyClientWriteProjectionHandler';
import {AgencyClientAggregateRecordInterface} from '../../src/AgencyClient/types';
import {
  LinkAgencyClientCommandDataInterface,
  SyncAgencyClientCommandDataInterface,
  AddAgencyClientConsultantCommandDataInterface,
  RemoveAgencyClientConsultantCommandDataInterface
} from '../../src/AgencyClient/types/CommandDataTypes';
import {EventsEnum} from '../../src/Events';
import {EventStore} from '../../src/models/EventStore';
import {assert} from 'chai';

describe('AgencyClientWriteProjectionHandler', () => {
  describe('execute()', () => {
    const projectionHandler = new AgencyClientWriteProjectionHandler();

    describe('AGENCY_CLIENT_LINKED Event', () => {
      it('Test success', () => {
        const aggregate: AgencyClientAggregateRecordInterface = {
          last_sequence_id: 1
        };
        const eventData: LinkAgencyClientCommandDataInterface = {
          client_type: 'site'
        };
        const event = new EventStore({
          type: 'sample',
          aggregate_id: {},
          data: eventData,
          sequence_id: 1,
          meta_data: {},
          correlation_id: 1
        });

        const result = projectionHandler.execute(EventsEnum.AGENCY_CLIENT_LINKED, aggregate, event);

        result.linked.should.to.be.true;
        result.client_type.should.to.equal('site');
      });
    });

    describe('AGENCY_CLIENT_UNLINKED Event', () => {
      it('Test success', () => {
        const aggregate: AgencyClientAggregateRecordInterface = {
          last_sequence_id: 1
        };
        const event = new EventStore({
          type: 'sample',
          aggregate_id: {},
          data: {},
          sequence_id: 1,
          meta_data: {},
          correlation_id: 1
        });

        const result = projectionHandler.execute(EventsEnum.AGENCY_CLIENT_UNLINKED, aggregate, event);

        result.linked.should.to.be.false;
      });
    });

    describe('AGENCY_CLIENT_SYNCED Event', () => {
      it('Test success', () => {
        const aggregate: AgencyClientAggregateRecordInterface = {
          last_sequence_id: 1
        };
        const eventData: SyncAgencyClientCommandDataInterface = {
          client_type: 'site',
          linked: false,
          linked_at: new Date()
        };
        const event = new EventStore({
          type: 'sample',
          aggregate_id: {},
          data: eventData,
          sequence_id: 1,
          meta_data: {},
          correlation_id: 1
        });

        const result = projectionHandler.execute(EventsEnum.AGENCY_CLIENT_SYNCED, aggregate, event);

        result.linked.should.to.be.false;
        result.client_type.should.to.equal('site');
      });
    });

    describe('AGENCY_CLIENT_CONSULTANT_ASSIGNED Event', () => {
      it('Test success', () => {
        const aggregate: AgencyClientAggregateRecordInterface = {
          last_sequence_id: 1
        };
        const eventData: AddAgencyClientConsultantCommandDataInterface = {
          _id: 'id',
          consultant_id: 'consultant id',
          consultant_role_id: 'consultant role id'
        };
        const event = new EventStore({
          type: 'sample',
          aggregate_id: {},
          data: eventData,
          sequence_id: 1,
          meta_data: {},
          correlation_id: 1
        });

        const result = projectionHandler.execute(EventsEnum.AGENCY_CLIENT_CONSULTANT_ASSIGNED, aggregate, event);

        result.consultants.should.to.deep.equal([
          {
            _id: 'id',
            consultant_id: 'consultant id',
            consultant_role_id: 'consultant role id'
          }
        ]);
      });
      it('Test push to consultants array', () => {
        const aggregate: AgencyClientAggregateRecordInterface = {
          last_sequence_id: 1,
          consultants: [
            {
              _id: 'id2',
              consultant_id: 'consultant id2',
              consultant_role_id: 'consultant role id2'
            }
          ]
        };
        const eventData: AddAgencyClientConsultantCommandDataInterface = {
          _id: 'id',
          consultant_id: 'consultant id',
          consultant_role_id: 'consultant role id'
        };
        const event = new EventStore({
          type: 'sample',
          aggregate_id: {},
          data: eventData,
          sequence_id: 1,
          meta_data: {},
          correlation_id: 1
        });

        const result = projectionHandler.execute(EventsEnum.AGENCY_CLIENT_CONSULTANT_ASSIGNED, aggregate, event);

        result.consultants.should.to.deep.equal([
          {
            _id: 'id2',
            consultant_id: 'consultant id2',
            consultant_role_id: 'consultant role id2'
          },
          {
            _id: 'id',
            consultant_id: 'consultant id',
            consultant_role_id: 'consultant role id'
          }
        ]);
      });
    });

    describe('AGENCY_CLIENT_CONSULTANT_UNASSIGNED Event', () => {
      it('Test when consultant exists', () => {
        const aggregate: AgencyClientAggregateRecordInterface = {
          last_sequence_id: 1,
          consultants: [
            {
              _id: 'id',
              consultant_id: 'consultant id2',
              consultant_role_id: 'consultant role id2'
            }
          ]
        };
        const eventData: RemoveAgencyClientConsultantCommandDataInterface = {
          _id: 'id'
        };
        const event = new EventStore({
          type: 'sample',
          aggregate_id: {},
          data: eventData,
          sequence_id: 1,
          meta_data: {},
          correlation_id: 1
        });

        const result = projectionHandler.execute(EventsEnum.AGENCY_CLIENT_CONSULTANT_UNASSIGNED, aggregate, event);

        result.consultants.should.to.be.empty;
      });
      it('Test when consultant does not exist', () => {
        const aggregate: AgencyClientAggregateRecordInterface = {
          last_sequence_id: 1,
          consultants: [
            {
              _id: 'idxx',
              consultant_id: 'consultant id2',
              consultant_role_id: 'consultant role id2'
            }
          ]
        };
        const eventData: RemoveAgencyClientConsultantCommandDataInterface = {
          _id: 'id'
        };
        const event = new EventStore({
          type: 'sample',
          aggregate_id: {},
          data: eventData,
          sequence_id: 1,
          meta_data: {},
          correlation_id: 1
        });

        const result = projectionHandler.execute(EventsEnum.AGENCY_CLIENT_CONSULTANT_UNASSIGNED, aggregate, event);

        result.consultants.should.to.deep.equal(aggregate.consultants);
      });
    });

    it('Test throw error when event not found', () => {
      const aggregate: AgencyClientAggregateRecordInterface = {
        last_sequence_id: 0
      };
      const event = new EventStore({
        type: 'sample',
        aggregate_id: {},
        data: {},
        sequence_id: 1,
        meta_data: {},
        correlation_id: 1
      });

      assert.throw(
        () => projectionHandler.execute(EventsEnum.AGENCY_CONSULTANT_ROLE_ENABLED, aggregate, event),
        Error,
        `Event type not supported: ${EventsEnum.AGENCY_CONSULTANT_ROLE_ENABLED}`
      );
    });
  });
});
