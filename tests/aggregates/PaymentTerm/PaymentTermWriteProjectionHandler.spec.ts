import {PaymentTermWriteProjectionHandler} from '../../../src/aggregates/PaymentTerm/PaymentTermWriteProjectionHandler';
import {PAYMENT_TERM_ENUM} from '../../../src/aggregates/PaymentTerm/types/PaymentTermAggregateRecordInterface';
import {EventsEnum} from '../../../src/Events';
import {EventStore} from '../../../src/models/EventStore';
import {assert} from 'chai';

describe('PaymentTermWriteProjectionHandler', () => {
  describe('execute()', () => {
    const projectionHandler = new PaymentTermWriteProjectionHandler();

    describe('AGENCY_CLIENT_CREDIT_PAYMENT_TERM_APPLIED Event', () => {
      it('Test event', () => {
        const aggregate: any = {
          last_sequence_id: 1
        };
        const event = new EventStore({
          type: EventsEnum.AGENCY_CLIENT_CREDIT_PAYMENT_TERM_APPLIED,
          aggregate_id: {},
          data: {},
          sequence_id: 1,
          meta_data: {
            user_id: 'fake_user'
          },
          correlation_id: 'fake_id'
        });

        const result = projectionHandler.execute(
          EventsEnum.AGENCY_CLIENT_CREDIT_PAYMENT_TERM_APPLIED,
          aggregate,
          event
        );

        result.inherited.should.be.false;
        result.payment_term.should.equal(PAYMENT_TERM_ENUM.CREDIT);
      });
    });

    describe('AGENCY_CLIENT_PAY_IN_ADVANCE_PAYMENT_TERM_APPLIED Event', () => {
      it('Test event', () => {
        const aggregate: any = {
          last_sequence_id: 1
        };
        const event = new EventStore({
          type: EventsEnum.AGENCY_CLIENT_PAY_IN_ADVANCE_PAYMENT_TERM_APPLIED,
          aggregate_id: {},
          data: {},
          sequence_id: 1,
          meta_data: {
            user_id: 'fake_user'
          },
          correlation_id: 'fake_id'
        });

        const result = projectionHandler.execute(
          EventsEnum.AGENCY_CLIENT_PAY_IN_ADVANCE_PAYMENT_TERM_APPLIED,
          aggregate,
          event
        );

        result.inherited.should.be.false;
        result.payment_term.should.equal(PAYMENT_TERM_ENUM.PAY_IN_ADVANCE);
      });
    });

    describe('AGENCY_CLIENT_EMPTY_PAYMENT_TERM_INHERITED Event', () => {
      it('Test event', () => {
        const aggregate: any = {
          last_sequence_id: 1
        };
        const event = new EventStore({
          type: EventsEnum.AGENCY_CLIENT_EMPTY_PAYMENT_TERM_INHERITED,
          aggregate_id: {},
          data: {},
          sequence_id: 1,
          meta_data: {
            user_id: 'fake_user'
          },
          correlation_id: 'fake_id'
        });

        const result = projectionHandler.execute(
          EventsEnum.AGENCY_CLIENT_EMPTY_PAYMENT_TERM_INHERITED,
          aggregate,
          event
        );

        result.inherited.should.be.true;
        (result.payment_term === null).should.be.true;
      });
    });

    describe('AGENCY_CLIENT_CREDIT_PAYMENT_TERM_INHERITED Event', () => {
      it('Test event', () => {
        const aggregate: any = {
          last_sequence_id: 1
        };
        const event = new EventStore({
          type: EventsEnum.AGENCY_CLIENT_CREDIT_PAYMENT_TERM_INHERITED,
          aggregate_id: {},
          data: {},
          sequence_id: 1,
          meta_data: {
            user_id: 'fake_user'
          },
          correlation_id: 'fake_id'
        });

        const result = projectionHandler.execute(
          EventsEnum.AGENCY_CLIENT_CREDIT_PAYMENT_TERM_INHERITED,
          aggregate,
          event
        );

        result.inherited.should.be.true;
        result.payment_term.should.equal(PAYMENT_TERM_ENUM.CREDIT);
      });
    });

    describe('AGENCY_CLIENT_PAY_IN_ADVANCE_PAYMENT_TERM_INHERITED Event', () => {
      it('Test event', () => {
        const aggregate: any = {
          last_sequence_id: 1
        };
        const event = new EventStore({
          type: EventsEnum.AGENCY_CLIENT_PAY_IN_ADVANCE_PAYMENT_TERM_INHERITED,
          aggregate_id: {},
          data: {},
          sequence_id: 1,
          meta_data: {
            user_id: 'fake_user'
          },
          correlation_id: 'fake_id'
        });

        const result = projectionHandler.execute(
          EventsEnum.AGENCY_CLIENT_PAY_IN_ADVANCE_PAYMENT_TERM_INHERITED,
          aggregate,
          event
        );

        result.inherited.should.be.true;
        result.payment_term.should.equal(PAYMENT_TERM_ENUM.PAY_IN_ADVANCE);
      });
    });

    it('Test throw error when event not found', () => {
      const aggregate: any = {
        last_sequence_id: 1
      };
      const event = new EventStore({
        type: EventsEnum.AGENCY_CLIENT_CONSULTANT_UNASSIGNED,
        aggregate_id: {},
        data: {},
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
