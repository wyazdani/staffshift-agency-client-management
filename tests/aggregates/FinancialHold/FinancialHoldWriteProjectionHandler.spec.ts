import {FinancialHoldWriteProjectionHandler} from '../../../src/aggregates/FinancialHold/FinancialHoldWriteProjectionHandler';
import {EventsEnum} from '../../../src/Events';
import {EventStore} from '../../../src/models/EventStore';
import {assert} from 'chai';

describe('FinancialHoldWriteProjectionHandler', () => {
  describe('execute()', () => {
    const projectionHandler = new FinancialHoldWriteProjectionHandler();
    const date = new Date();
    const note = 'sample note';

    describe('AGENCY_CLIENT_FINANCIAL_HOLD_APPLIED Event', () => {
      it('Test event', () => {
        const aggregate: any = {
          last_sequence_id: 1
        };
        const event = new EventStore({
          type: EventsEnum.AGENCY_CLIENT_FINANCIAL_HOLD_APPLIED,
          aggregate_id: {},
          data: {note},
          sequence_id: 1,
          meta_data: {
            user_id: 'fake_user'
          },
          correlation_id: 'fake_id',
          created_at: date
        });

        const result = projectionHandler.execute(EventsEnum.AGENCY_CLIENT_FINANCIAL_HOLD_APPLIED, aggregate, event);

        result.inherited.should.be.false;
        result.financial_hold.should.be.true;
        result.last_event_date.should.equal(date);
        result.note.should.equal(note);
      });
    });

    describe('AGENCY_CLIENT_FINANCIAL_HOLD_CLEARED Event', () => {
      it('Test event', () => {
        const aggregate: any = {
          last_sequence_id: 1
        };
        const event = new EventStore({
          type: EventsEnum.AGENCY_CLIENT_FINANCIAL_HOLD_CLEARED,
          aggregate_id: {},
          data: {note},
          sequence_id: 1,
          meta_data: {
            user_id: 'fake_user'
          },
          correlation_id: 'fake_id',
          created_at: date
        });

        const result = projectionHandler.execute(EventsEnum.AGENCY_CLIENT_FINANCIAL_HOLD_CLEARED, aggregate, event);

        result.inherited.should.be.false;
        result.financial_hold.should.be.false;
        result.last_event_date.should.equal(date);
        result.note.should.equal(note);
      });
    });

    describe('AGENCY_CLIENT_CLEAR_FINANCIAL_HOLD_INHERITED Event', () => {
      it('Test event', () => {
        const aggregate: any = {
          last_sequence_id: 1
        };
        const event = new EventStore({
          type: EventsEnum.AGENCY_CLIENT_CLEAR_FINANCIAL_HOLD_INHERITED,
          aggregate_id: {},
          data: {note},
          sequence_id: 1,
          meta_data: {
            user_id: 'fake_user'
          },
          correlation_id: 'fake_id',
          created_at: date
        });

        const result = projectionHandler.execute(
          EventsEnum.AGENCY_CLIENT_CLEAR_FINANCIAL_HOLD_INHERITED,
          aggregate,
          event
        );

        result.inherited.should.be.true;
        result.financial_hold.should.be.false;
        result.last_event_date.should.equal(date);
        result.note.should.equal(note);
      });
    });

    describe('AGENCY_CLIENT_FINANCIAL_HOLD_INHERITED Event', () => {
      it('Test event', () => {
        const aggregate: any = {
          last_sequence_id: 1
        };
        const event = new EventStore({
          type: EventsEnum.AGENCY_CLIENT_FINANCIAL_HOLD_INHERITED,
          aggregate_id: {},
          data: {note},
          sequence_id: 1,
          meta_data: {
            user_id: 'fake_user'
          },
          correlation_id: 'fake_id',
          created_at: date
        });

        const result = projectionHandler.execute(EventsEnum.AGENCY_CLIENT_FINANCIAL_HOLD_INHERITED, aggregate, event);

        result.inherited.should.be.true;
        result.financial_hold.should.be.true;
        result.last_event_date.should.equal(date);
        result.note.should.equal(note);
      });
    });

    describe('AGENCY_CLIENT_EMPTY_FINANCIAL_HOLD_INHERITED Event', () => {
      it('Test event', () => {
        const aggregate: any = {
          last_sequence_id: 1
        };
        const event = new EventStore({
          type: EventsEnum.AGENCY_CLIENT_EMPTY_FINANCIAL_HOLD_INHERITED,
          aggregate_id: {},
          data: {},
          sequence_id: 1,
          meta_data: {
            user_id: 'fake_user'
          },
          correlation_id: 'fake_id',
          created_at: date
        });

        const result = projectionHandler.execute(
          EventsEnum.AGENCY_CLIENT_EMPTY_FINANCIAL_HOLD_INHERITED,
          aggregate,
          event
        );

        result.inherited.should.be.true;
        (result.financial_hold === null).should.be.true;
        result.last_event_date.should.equal(date);
        (result.note === null).should.be.true;
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
