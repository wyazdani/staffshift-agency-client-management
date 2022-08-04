import {AgencyClientWriteProjectionHandler} from '../../../src/aggregates/AgencyClient/AgencyClientWriteProjectionHandler';
import {AgencyClientAggregateRecordInterface} from '../../../src/aggregates/AgencyClient/types';
import {
  AgencyClientConsultantAssignedEventStoreDataInterface,
  AgencyClientConsultantUnassignedEventStoreDataInterface,
  AgencyClientLinkedEventStoreDataInterface,
  AgencyClientSyncedEventStoreDataInterface
} from '../../../src/types/EventTypes';

import {EventsEnum} from '../../../src/Events';
import {EventStore} from '../../../src/models/EventStore';
import {assert} from 'chai';

describe('AgencyClientWriteProjectionHandler', () => {
  describe('execute()', () => {
    const projectionHandler = new AgencyClientWriteProjectionHandler();
    const date = new Date();

    describe('AGENCY_CLIENT_LINKED Event', () => {
      it('Test when the client type is site', () => {
        const aggregate: AgencyClientAggregateRecordInterface = {
          last_sequence_id: 1
        };
        const eventData: AgencyClientLinkedEventStoreDataInterface = {
          client_type: 'site',
          organisation_id: 'org id'
        };
        const event = new EventStore({
          type: EventsEnum.AGENCY_CLIENT_LINKED,
          aggregate_id: {},
          data: eventData,
          sequence_id: 1,
          meta_data: {
            user_id: 'fake_user'
          },
          correlation_id: 'fake_id',
          created_at: date
        });

        const result = projectionHandler.execute(EventsEnum.AGENCY_CLIENT_LINKED, aggregate, event);

        result.linked.should.be.true;
        result.client_type.should.equal('site');
        result.parent_id.should.equal('org id');
        result.linked_date.should.equal(date);
      });
      it('Test when the client type is ward', () => {
        const aggregate: AgencyClientAggregateRecordInterface = {
          last_sequence_id: 1
        };
        const eventData: AgencyClientLinkedEventStoreDataInterface = {
          client_type: 'ward',
          organisation_id: 'org id',
          site_id: 'site id'
        };
        const event = new EventStore({
          type: EventsEnum.AGENCY_CLIENT_LINKED,
          aggregate_id: {},
          data: eventData,
          sequence_id: 1,
          meta_data: {
            user_id: 'fake_user'
          },
          correlation_id: 'fake_id',
          created_at: date
        });

        const result = projectionHandler.execute(EventsEnum.AGENCY_CLIENT_LINKED, aggregate, event);

        result.linked.should.be.true;
        result.client_type.should.equal('ward');
        result.parent_id.should.equal('site id');
        result.linked_date.should.equal(date);
      });
      it('Test when the client type is organisation', () => {
        const aggregate: AgencyClientAggregateRecordInterface = {
          last_sequence_id: 1
        };
        const eventData: AgencyClientLinkedEventStoreDataInterface = {
          client_type: 'organisation'
        };
        const event = new EventStore({
          type: EventsEnum.AGENCY_CLIENT_LINKED,
          aggregate_id: {
            client_id: 'organisation_id'
          },
          data: eventData,
          sequence_id: 1,
          meta_data: {
            user_id: 'fake_user'
          },
          correlation_id: 'fake_id',
          created_at: date
        });

        const result = projectionHandler.execute(EventsEnum.AGENCY_CLIENT_LINKED, aggregate, event);

        result.linked.should.be.true;
        result.client_type.should.equal('organisation');
        (result.parent_id === undefined).should.be.true;
        result.linked_date.should.equal(date);
      });
    });

    describe('AGENCY_CLIENT_UNLINKED Event', () => {
      it('Test success', () => {
        const aggregate: AgencyClientAggregateRecordInterface = {
          last_sequence_id: 1
        };
        const event = new EventStore({
          type: EventsEnum.AGENCY_CLIENT_UNLINKED,
          aggregate_id: {},
          data: {},
          sequence_id: 1,
          meta_data: {
            user_id: 'fake_user'
          },
          correlation_id: 'fake_id',
          created_at: date
        });

        const result = projectionHandler.execute(EventsEnum.AGENCY_CLIENT_UNLINKED, aggregate, event);

        result.linked.should.be.false;
        (result.linked_date === null).should.be.true;
      });
    });

    describe('AGENCY_CLIENT_SYNCED Event', () => {
      it('Test success when the type is site', () => {
        const aggregate: AgencyClientAggregateRecordInterface = {
          last_sequence_id: 1
        };
        const eventData: AgencyClientSyncedEventStoreDataInterface = {
          client_type: 'site',
          organisation_id: 'org id',
          linked: false,
          linked_at: new Date()
        };
        const event = new EventStore({
          type: EventsEnum.AGENCY_CLIENT_SYNCED,
          aggregate_id: {},
          data: eventData,
          sequence_id: 1,
          meta_data: {
            user_id: 'fake_user'
          },
          correlation_id: 'fake_id',
          created_at: date
        });

        const result = projectionHandler.execute(EventsEnum.AGENCY_CLIENT_SYNCED, aggregate, event);

        result.linked.should.be.false;
        result.client_type.should.equal('site');
        result.parent_id.should.equal('org id');
        result.linked_date.should.equal(date);
      });

      it('Test success when the type is ward', () => {
        const aggregate: AgencyClientAggregateRecordInterface = {
          last_sequence_id: 1
        };
        const eventData: AgencyClientSyncedEventStoreDataInterface = {
          client_type: 'ward',
          organisation_id: 'org id',
          site_id: 'site id',
          linked: false,
          linked_at: new Date()
        };
        const event = new EventStore({
          type: EventsEnum.AGENCY_CLIENT_SYNCED,
          aggregate_id: {},
          data: eventData,
          sequence_id: 1,
          meta_data: {
            user_id: 'fake_user'
          },
          correlation_id: 'fake_id',
          created_at: date
        });

        const result = projectionHandler.execute(EventsEnum.AGENCY_CLIENT_SYNCED, aggregate, event);

        result.linked.should.be.false;
        result.client_type.should.equal('ward');
        result.parent_id.should.equal('site id');
        result.linked_date.should.equal(date);
      });

      it('Test success when the type is org', () => {
        const aggregate: AgencyClientAggregateRecordInterface = {
          last_sequence_id: 1
        };
        const eventData: AgencyClientSyncedEventStoreDataInterface = {
          client_type: 'organisation',
          linked: false,
          linked_at: new Date()
        };
        const event = new EventStore({
          type: EventsEnum.AGENCY_CLIENT_SYNCED,
          aggregate_id: {},
          data: eventData,
          sequence_id: 1,
          meta_data: {
            user_id: 'fake_user'
          },
          correlation_id: 'fake_id',
          created_at: date
        });

        const result = projectionHandler.execute(EventsEnum.AGENCY_CLIENT_SYNCED, aggregate, event);

        result.linked.should.be.false;
        result.client_type.should.equal('organisation');
        (result.parent_id === undefined).should.be.true;
        result.linked_date.should.equal(date);
      });
    });

    describe('AGENCY_CLIENT_CONSULTANT_ASSIGNED Event', () => {
      it('Test success', () => {
        const aggregate: AgencyClientAggregateRecordInterface = {
          last_sequence_id: 1
        };
        const eventData: AgencyClientConsultantAssignedEventStoreDataInterface = {
          _id: 'id',
          consultant_id: 'consultant id',
          consultant_role_id: 'consultant role id'
        };
        const event = new EventStore({
          type: EventsEnum.AGENCY_CLIENT_CONSULTANT_ASSIGNED,
          aggregate_id: {},
          data: eventData,
          sequence_id: 1,
          meta_data: {
            user_id: 'fake_user'
          },
          correlation_id: 'fake_id'
        });

        const result = projectionHandler.execute(EventsEnum.AGENCY_CLIENT_CONSULTANT_ASSIGNED, aggregate, event);

        result.consultants.should.deep.equal([
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
        const eventData: AgencyClientConsultantAssignedEventStoreDataInterface = {
          _id: 'id',
          consultant_id: 'consultant id',
          consultant_role_id: 'consultant role id'
        };
        const event = new EventStore({
          type: EventsEnum.AGENCY_CLIENT_CONSULTANT_ASSIGNED,
          aggregate_id: {},
          data: eventData,
          sequence_id: 1,
          meta_data: {
            user_id: 'fake_user'
          },
          correlation_id: 'fake_id'
        });

        const result = projectionHandler.execute(EventsEnum.AGENCY_CLIENT_CONSULTANT_ASSIGNED, aggregate, event);

        result.consultants.should.deep.equal([
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
        const eventData: AgencyClientConsultantUnassignedEventStoreDataInterface = {
          _id: 'id'
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

        const result = projectionHandler.execute(EventsEnum.AGENCY_CLIENT_CONSULTANT_UNASSIGNED, aggregate, event);

        result.consultants.should.be.empty;
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
        const eventData: AgencyClientConsultantUnassignedEventStoreDataInterface = {
          _id: 'id'
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

        const result = projectionHandler.execute(EventsEnum.AGENCY_CLIENT_CONSULTANT_UNASSIGNED, aggregate, event);

        result.consultants.should.deep.equal(aggregate.consultants);
      });
    });

    it('Test throw error when event not found', () => {
      const aggregate: AgencyClientAggregateRecordInterface = {
        last_sequence_id: 0
      };
      const event = new EventStore({
        type: EventsEnum.AGENCY_CONSULTANT_ROLE_ENABLED,
        aggregate_id: {},
        data: {},
        sequence_id: 1,
        meta_data: {
          user_id: 'fake_user'
        },
        correlation_id: 'fake_id'
      });

      assert.throw(
        () => projectionHandler.execute(EventsEnum.AGENCY_CONSULTANT_ROLE_ENABLED, aggregate, event),
        Error,
        `Event type not supported: ${EventsEnum.AGENCY_CONSULTANT_ROLE_ENABLED}`
      );
    });
  });
});
