import {OrganisationJobWriteProjectionHandler} from '../../../src/aggregates/OrganisationJob/OrganisationJobWriteProjectionHandler';
import {EventsEnum} from '../../../src/Events';
import {EventStore} from '../../../src/models/EventStore';
import {assert} from 'chai';
import {AgencyConsultantRoleEnabledEventStoreDataInterface} from '../../../src/types/EventTypes';
import {AgencyClientApplyPaymentTermInitiatedEventInterface} from '../../../src/types/EventTypes/AgencyClientApplyPaymentTermInitiatedEventInterface';
import {OrganisationJobCommandEnum} from '../../../src/aggregates/OrganisationJob/types';

describe('OrganisationJobWriteProjectionHandler', () => {
  describe('execute()', () => {
    const projectionHandler = new OrganisationJobWriteProjectionHandler();
    const clientId = 'client_id';
    const agencyId = 'agency_id';
    const organisationId = 'organisation_id';

    describe('INITIATE_APPLY_PAYMENT_TERM Event', () => {
      it('Test when success', () => {
        const aggregate: any = {
          last_sequence_id: 1
        };
        const eventData = {
          _id: 'id',
          client_id: clientId,
          term: 'credit'
        };
        const event = new EventStore({
          type: EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_INITIATED,
          aggregate_id: {
            name: OrganisationJobCommandEnum.INITIATE_APPLY_PAYMENT_TERM,
            agency_id: agencyId,
            organisation: organisationId
          },
          data: eventData,
          sequence_id: 2,
          meta_data: {
            user_id: 'fake_user'
          },
          correlation_id: 'fake_id'
        });

        const result = projectionHandler.execute(
          EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_INITIATED,
          aggregate,
          event
        );

        result.payment_terms.should.deep.equal({
          id: 'started'
        });
      });
    });

    describe('INITIATE_INHERIT_PAYMENT_TERM Event', () => {
      it('Test when success', () => {
        const aggregate: any = {
          last_sequence_id: 1
        };
        const eventData = {
          _id: 'id'
        };
        const event = new EventStore({
          type: EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_INHERITANCE_INITIATED,
          aggregate_id: {
            name: OrganisationJobCommandEnum.INITIATE_INHERIT_PAYMENT_TERM,
            agency_id: agencyId,
            organisation: organisationId
          },
          data: eventData,
          sequence_id: 2,
          meta_data: {
            user_id: 'fake_user'
          },
          correlation_id: 'fake_id'
        });

        const result = projectionHandler.execute(
          EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_INHERITANCE_INITIATED,
          aggregate,
          event
        );

        result.payment_terms.should.deep.equal({
          id: 'started'
        });
      });
    });

    describe('COMPLETE_APPLY_PAYMENT_TERM Event', () => {
      it('Test when success', () => {
        const aggregate: any = {
          last_sequence_id: 1
        };
        const eventData = {
          _id: 'id'
        };
        const event = new EventStore({
          type: EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_COMPLETED,
          aggregate_id: {
            name: OrganisationJobCommandEnum.COMPLETE_APPLY_PAYMENT_TERM,
            agency_id: agencyId,
            organisation: organisationId
          },
          data: eventData,
          sequence_id: 2,
          meta_data: {
            user_id: 'fake_user'
          },
          correlation_id: 'fake_id'
        });

        const result = projectionHandler.execute(
          EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_COMPLETED,
          aggregate,
          event
        );

        result.payment_terms.should.deep.equal({
          id: 'completed'
        });
      });
    });

    describe('COMPLETE_APPLY_PAYMENT_TERM Event', () => {
      it('Test when success', () => {
        const aggregate: any = {
          last_sequence_id: 1
        };
        const eventData = {
          _id: 'id'
        };
        const event = new EventStore({
          type: EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_INHERITANCE_COMPLETED,
          aggregate_id: {
            name: OrganisationJobCommandEnum.COMPLETE_INHERIT_PAYMENT_TERM,
            agency_id: agencyId,
            organisation: organisationId
          },
          data: eventData,
          sequence_id: 2,
          meta_data: {
            user_id: 'fake_user'
          },
          correlation_id: 'fake_id'
        });

        const result = projectionHandler.execute(
          EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_INHERITANCE_COMPLETED,
          aggregate,
          event
        );

        result.payment_terms.should.deep.equal({
          id: 'completed'
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
