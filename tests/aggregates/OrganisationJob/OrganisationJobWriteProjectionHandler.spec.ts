import {OrganisationJobWriteProjectionHandler} from '../../../src/aggregates/OrganisationJob/OrganisationJobWriteProjectionHandler';
import {EventsEnum} from '../../../src/Events';
import {EventStore} from '../../../src/models/EventStore';
import {assert} from 'chai';
import {AgencyConsultantRoleEnabledEventStoreDataInterface} from '../../../src/types/EventTypes';
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

        result.payment_term_jobs.should.deep.equal({
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

        result.payment_term_jobs.should.deep.equal({
          id: 'started_inherited'
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

        result.payment_term_jobs.should.deep.equal({
          id: 'completed'
        });
      });
    });

    describe('COMPLETE_INHERIT_PAYMENT_TERM Event', () => {
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

        result.payment_term_jobs.should.deep.equal({
          id: 'completed_inherited'
        });
      });
    });

    describe('INITIATE_APPLY_FINANCIAL_HOLD Event', () => {
      it('Test when success', () => {
        const aggregate: any = {
          last_sequence_id: 1
        };
        const eventData = {
          _id: 'id',
          client_id: clientId,
          note: 'test'
        };
        const event = new EventStore({
          type: EventsEnum.AGENCY_CLIENT_APPLY_FINANCIAL_HOLD_INITIATED,
          aggregate_id: {
            name: OrganisationJobCommandEnum.INITIATE_APPLY_FINANCIAL_HOLD,
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
          EventsEnum.AGENCY_CLIENT_APPLY_FINANCIAL_HOLD_INITIATED,
          aggregate,
          event
        );

        result.financial_hold_jobs.should.deep.equal({
          id: {
            status: 'started',
            type: 'applied'
          }
        });
      });
    });

    describe('INITIATE_CLEAR_FINANCIAL_HOLD Event', () => {
      it('Test when success', () => {
        const aggregate: any = {
          last_sequence_id: 1
        };
        const eventData = {
          _id: 'id',
          client_id: clientId,
          note: 'test'
        };
        const event = new EventStore({
          type: EventsEnum.AGENCY_CLIENT_CLEAR_FINANCIAL_HOLD_INITIATED,
          aggregate_id: {
            name: OrganisationJobCommandEnum.INITIATE_CLEAR_FINANCIAL_HOLD,
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
          EventsEnum.AGENCY_CLIENT_CLEAR_FINANCIAL_HOLD_INITIATED,
          aggregate,
          event
        );

        result.financial_hold_jobs.should.deep.equal({
          id: {
            status: 'started',
            type: 'cleared'
          }
        });
      });
    });

    describe('INITIATE_INHERIT_FINANCIAL_HOLD Event', () => {
      it('Test when success', () => {
        const aggregate: any = {
          last_sequence_id: 1
        };
        const eventData = {
          _id: 'id',
          client_id: clientId,
          note: 'test'
        };
        const event = new EventStore({
          type: EventsEnum.AGENCY_CLIENT_APPLY_FINANCIAL_HOLD_INHERITANCE_INITIATED,
          aggregate_id: {
            name: OrganisationJobCommandEnum.INITIATE_INHERIT_FINANCIAL_HOLD,
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
          EventsEnum.AGENCY_CLIENT_APPLY_FINANCIAL_HOLD_INHERITANCE_INITIATED,
          aggregate,
          event
        );

        result.financial_hold_jobs.should.deep.equal({
          id: {
            status: 'started',
            type: 'applied_inherited'
          }
        });
      });
    });

    describe('COMPLETE_APPLY_FINANCIAL_HOLD Event', () => {
      it('Test success scenario', () => {
        const aggregate: any = {
          last_sequence_id: 1,
          financial_hold_jobs: {
            id: {
              status: 'started'
            }
          }
        };
        const eventData = {
          _id: 'id'
        };

        const event = new EventStore({
          type: EventsEnum.AGENCY_CLIENT_APPLY_FINANCIAL_HOLD_COMPLETED,
          aggregate_id: {
            name: OrganisationJobCommandEnum.COMPLETE_APPLY_FINANCIAL_HOLD,
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
          EventsEnum.AGENCY_CLIENT_APPLY_FINANCIAL_HOLD_COMPLETED,
          aggregate,
          event
        );

        result.financial_hold_jobs.should.deep.equal({
          id: {
            status: 'completed'
          }
        });
      });
    });

    describe('COMPLETE_CLEAR_FINANCIAL_HOLD Event', () => {
      it('Test when success', () => {
        const aggregate: any = {
          last_sequence_id: 1,
          financial_hold_jobs: {
            id: {
              status: 'started'
            }
          }
        };
        const eventData = {
          _id: 'id'
        };
        const event = new EventStore({
          type: EventsEnum.AGENCY_CLIENT_CLEAR_FINANCIAL_HOLD_COMPLETED,
          aggregate_id: {
            name: OrganisationJobCommandEnum.COMPLETE_CLEAR_FINANCIAL_HOLD,
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
          EventsEnum.AGENCY_CLIENT_CLEAR_FINANCIAL_HOLD_COMPLETED,
          aggregate,
          event
        );

        result.financial_hold_jobs.should.deep.equal({
          id: {
            status: 'completed'
          }
        });
      });
    });

    describe('COMPLETE_INHERIT_FINANCIAL_HOLD Event', () => {
      it('Test when success', () => {
        const aggregate: any = {
          last_sequence_id: 1,
          financial_hold_jobs: {
            id: {
              status: 'started'
            }
          }
        };
        const eventData = {
          _id: 'id'
        };
        const event = new EventStore({
          type: EventsEnum.AGENCY_CLIENT_APPLY_FINANCIAL_HOLD_INHERITANCE_COMPLETED,
          aggregate_id: {
            name: OrganisationJobCommandEnum.COMPLETE_INHERIT_FINANCIAL_HOLD,
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
          EventsEnum.AGENCY_CLIENT_APPLY_FINANCIAL_HOLD_INHERITANCE_COMPLETED,
          aggregate,
          event
        );

        result.financial_hold_jobs.should.deep.equal({
          id: {
            status: 'completed'
          }
        });
      });
    });

    it('Test throw error when event not found', () => {
      const aggregate: any = {
        last_sequence_id: 1,
        financial_hold_jobs: {
          id: {
            status: 'started'
          }
        }
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
