import {AgencyWriteProjectionHandler} from '../../../src/aggregates/Agency/AgencyWriteProjectionHandler';
import {AgencyAggregateRecordInterface, AgencyConsultantRoleEnum} from '../../../src/aggregates/Agency/types';
import {EventsEnum} from '../../../src/Events';
import {EventStore} from '../../../src/models/EventStore';
import {assert} from 'chai';
import {
  AgencyConsultantRoleAddedEventStoreDataInterface,
  AgencyConsultantRoleDetailsUpdatedEventStoreDataInterface,
  AgencyConsultantRoleEnabledEventStoreDataInterface
} from '../../../src/types/EventTypes';

describe('AgencyWriteProjectionHandler', () => {
  describe('execute()', () => {
    const projectionHandler = new AgencyWriteProjectionHandler();

    describe('AGENCY_CONSULTANT_ROLE_ADDED Event', () => {
      it('Test success', () => {
        const aggregate: AgencyAggregateRecordInterface = {
          last_sequence_id: 1,
          consultant_roles: []
        };
        const eventData: AgencyConsultantRoleAddedEventStoreDataInterface = {
          _id: 'sample',
          description: 'sample2',
          max_consultants: 2,
          name: 'name1'
        };
        const event = new EventStore({
          type: EventsEnum.AGENCY_CONSULTANT_ROLE_ADDED,
          aggregate_id: {},
          data: eventData,
          sequence_id: 1,
          meta_data: {
            user_id: 'fake_user'
          },
          correlation_id: 'fake_id'
        });

        const result = projectionHandler.execute(EventsEnum.AGENCY_CONSULTANT_ROLE_ADDED, aggregate, event);

        result.consultant_roles[0].should.deep.equal(eventData);
      });
    });
    describe('AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED Event', () => {
      it('Test when record found', () => {
        const aggregate: AgencyAggregateRecordInterface = {
          last_sequence_id: 1,
          consultant_roles: [
            {
              _id: 'sample',
              name: 'sss',
              description: 'vvv',
              max_consultants: 2
            }
          ]
        };
        const eventData: AgencyConsultantRoleDetailsUpdatedEventStoreDataInterface = {
          _id: 'sample',
          description: 'sample2',
          max_consultants: 3,
          name: 'name3'
        };
        const event = new EventStore({
          type: EventsEnum.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED,
          aggregate_id: {},
          data: eventData,
          sequence_id: 1,
          meta_data: {
            user_id: 'fake_user'
          },
          correlation_id: 'fake_id'
        });

        const result = projectionHandler.execute(EventsEnum.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED, aggregate, event);

        result.consultant_roles[0].should.deep.equal(eventData);
      });

      it('Test when record not found', () => {
        const aggregate: AgencyAggregateRecordInterface = {
          last_sequence_id: 1,
          consultant_roles: [
            {
              _id: 'samplex',
              name: 'sss',
              description: 'vvv',
              max_consultants: 2
            }
          ]
        };
        const eventData: AgencyConsultantRoleDetailsUpdatedEventStoreDataInterface = {
          _id: 'sample',
          description: 'sample2',
          max_consultants: 3,
          name: 'name3'
        };
        const event = new EventStore({
          type: EventsEnum.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED,
          aggregate_id: {},
          data: eventData,
          sequence_id: 1,
          meta_data: {
            user_id: 'fake_user'
          },
          correlation_id: 'fake_id'
        });

        const result = projectionHandler.execute(EventsEnum.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED, aggregate, event);

        result.consultant_roles.should.deep.equal(aggregate.consultant_roles);
      });
    });

    describe('AGENCY_CONSULTANT_ROLE_ENABLED Event', () => {
      it('Test Success', () => {
        const aggregate: AgencyAggregateRecordInterface = {
          last_sequence_id: 1,
          consultant_roles: [
            {
              _id: 'sample',
              name: 'sss',
              description: 'vvv',
              max_consultants: 2,
              status: AgencyConsultantRoleEnum.AGENCY_CONSULTANT_ROLE_STATUS_DISABLED
            },
            {
              _id: 'oops',
              name: 'sss',
              description: 'vvv',
              max_consultants: 2,
              status: AgencyConsultantRoleEnum.AGENCY_CONSULTANT_ROLE_STATUS_DISABLED
            }
          ]
        };
        const eventData: AgencyConsultantRoleEnabledEventStoreDataInterface = {
          _id: 'oops'
        };
        const event = new EventStore({
          type: EventsEnum.AGENCY_CONSULTANT_ROLE_ENABLED,
          aggregate_id: {},
          data: eventData,
          sequence_id: 1,
          meta_data: {
            user_id: 'fake_user'
          },
          correlation_id: 'fake_id'
        });

        const result = projectionHandler.execute(EventsEnum.AGENCY_CONSULTANT_ROLE_ENABLED, aggregate, event);

        result.consultant_roles[0].status.should.equal(AgencyConsultantRoleEnum.AGENCY_CONSULTANT_ROLE_STATUS_DISABLED);
        result.consultant_roles[1].status.should.equal(AgencyConsultantRoleEnum.AGENCY_CONSULTANT_ROLE_STATUS_ENABLED);
      });

      it('Test when role not found', () => {
        const aggregate: AgencyAggregateRecordInterface = {
          last_sequence_id: 1,
          consultant_roles: [
            {
              _id: 'sample',
              name: 'sss',
              description: 'vvv',
              max_consultants: 2,
              status: AgencyConsultantRoleEnum.AGENCY_CONSULTANT_ROLE_STATUS_DISABLED
            },
            {
              _id: 'oops',
              name: 'sss',
              description: 'vvv',
              max_consultants: 2,
              status: AgencyConsultantRoleEnum.AGENCY_CONSULTANT_ROLE_STATUS_DISABLED
            }
          ]
        };
        const eventData: AgencyConsultantRoleEnabledEventStoreDataInterface = {
          _id: 'oopsxx'
        };
        const event = new EventStore({
          type: EventsEnum.AGENCY_CONSULTANT_ROLE_ENABLED,
          aggregate_id: {},
          data: eventData,
          sequence_id: 1,
          meta_data: {
            user_id: 'fake_user'
          },
          correlation_id: 'fake_id'
        });

        const result = projectionHandler.execute(EventsEnum.AGENCY_CONSULTANT_ROLE_ENABLED, aggregate, event);

        result.consultant_roles.should.deep.equal(aggregate.consultant_roles);
      });
    });

    describe('AGENCY_CONSULTANT_ROLE_DISABLED Event', () => {
      it('Test when role found', () => {
        const aggregate: AgencyAggregateRecordInterface = {
          last_sequence_id: 1,
          consultant_roles: [
            {
              _id: 'sample',
              name: 'sss',
              description: 'vvv',
              max_consultants: 2,
              status: AgencyConsultantRoleEnum.AGENCY_CONSULTANT_ROLE_STATUS_ENABLED
            },
            {
              _id: 'oops',
              name: 'sss',
              description: 'vvv',
              max_consultants: 2,
              status: AgencyConsultantRoleEnum.AGENCY_CONSULTANT_ROLE_STATUS_ENABLED
            }
          ]
        };
        const eventData: AgencyConsultantRoleEnabledEventStoreDataInterface = {
          _id: 'oops'
        };
        const event = new EventStore({
          type: EventsEnum.AGENCY_CONSULTANT_ROLE_DISABLED,
          aggregate_id: {},
          data: eventData,
          sequence_id: 1,
          meta_data: {
            user_id: 'fake_user'
          },
          correlation_id: 'fake_id'
        });

        const result = projectionHandler.execute(EventsEnum.AGENCY_CONSULTANT_ROLE_DISABLED, aggregate, event);

        result.consultant_roles[0].status.should.equal(AgencyConsultantRoleEnum.AGENCY_CONSULTANT_ROLE_STATUS_ENABLED);
        result.consultant_roles[1].status.should.equal(AgencyConsultantRoleEnum.AGENCY_CONSULTANT_ROLE_STATUS_DISABLED);
      });

      it('Test when role not found', () => {
        const aggregate: AgencyAggregateRecordInterface = {
          last_sequence_id: 1,
          consultant_roles: [
            {
              _id: 'sample',
              name: 'sss',
              description: 'vvv',
              max_consultants: 2,
              status: AgencyConsultantRoleEnum.AGENCY_CONSULTANT_ROLE_STATUS_ENABLED
            },
            {
              _id: 'oops',
              name: 'sss',
              description: 'vvv',
              max_consultants: 2,
              status: AgencyConsultantRoleEnum.AGENCY_CONSULTANT_ROLE_STATUS_ENABLED
            }
          ]
        };
        const eventData: AgencyConsultantRoleEnabledEventStoreDataInterface = {
          _id: 'oopsx'
        };
        const event = new EventStore({
          type: EventsEnum.AGENCY_CONSULTANT_ROLE_DISABLED,
          aggregate_id: {},
          data: eventData,
          sequence_id: 1,
          meta_data: {
            user_id: 'fake_user'
          },
          correlation_id: 'fake_id'
        });

        const result = projectionHandler.execute(EventsEnum.AGENCY_CONSULTANT_ROLE_DISABLED, aggregate, event);

        result.consultant_roles.should.deep.equal(aggregate.consultant_roles);
      });
    });

    it('Test throw error when event not found', () => {
      const aggregate: AgencyAggregateRecordInterface = {
        last_sequence_id: 1,
        consultant_roles: []
      };
      const eventData: AgencyConsultantRoleEnabledEventStoreDataInterface = {
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
        `Event not supported ${EventsEnum.AGENCY_CLIENT_CONSULTANT_UNASSIGNED}`
      );
    });
  });
});
