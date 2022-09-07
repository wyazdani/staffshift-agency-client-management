import {BookingPreferenceWriteProjectionHandler} from '../../../src/aggregates/BookingPreference/BookingPreferenceWriteProjectionHandler';
import {EventsEnum} from '../../../src/Events';
import {EventStore} from '../../../src/models/EventStore';
import {assert} from 'chai';

describe('BookingPreferenceWriteProjectionHandler', () => {
  describe('execute()', () => {
    const projectionHandler = new BookingPreferenceWriteProjectionHandler();
    const date = new Date();
    const payload = {
      booking_passwords: ['test']
    };

    describe('AGENCY_CLIENT_REQUIRES_PO_NUMBER_SET Event', () => {
      it('Test success scenario', () => {
        const aggregate: any = {
          last_sequence_id: 1
        };
        const event = new EventStore({
          type: EventsEnum.AGENCY_CLIENT_REQUIRES_PO_NUMBER_SET,
          aggregate_id: {},
          data: {},
          sequence_id: 1,
          meta_data: {
            user_id: 'fake_user'
          },
          correlation_id: 'fake_id',
          created_at: date
        });

        const result = projectionHandler.execute(EventsEnum.AGENCY_CLIENT_REQUIRES_PO_NUMBER_SET, aggregate, event);

        result.requires_po_number.should.be.true;
      });
    });

    describe('AGENCY_CLIENT_REQUIRES_PO_NUMBER_UNSET Event', () => {
      it('Test success scenario', () => {
        const aggregate: any = {
          last_sequence_id: 1
        };
        const event = new EventStore({
          type: EventsEnum.AGENCY_CLIENT_REQUIRES_PO_NUMBER_UNSET,
          aggregate_id: {},
          data: {},
          sequence_id: 1,
          meta_data: {
            user_id: 'fake_user'
          },
          correlation_id: 'fake_id',
          created_at: date
        });

        const result = projectionHandler.execute(EventsEnum.AGENCY_CLIENT_REQUIRES_PO_NUMBER_UNSET, aggregate, event);

        result.requires_po_number.should.be.false;
        result.requires_unique_po_number.should.be.false;
      });
    });

    describe('AGENCY_CLIENT_REQUIRES_UNIQUE_PO_NUMBER_SET Event', () => {
      it('Test success scenario', () => {
        const aggregate: any = {
          last_sequence_id: 1
        };
        const event = new EventStore({
          type: EventsEnum.AGENCY_CLIENT_REQUIRES_UNIQUE_PO_NUMBER_SET,
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
          EventsEnum.AGENCY_CLIENT_REQUIRES_UNIQUE_PO_NUMBER_SET,
          aggregate,
          event
        );

        result.requires_unique_po_number.should.be.true;
      });
    });

    describe('AGENCY_CLIENT_REQUIRES_UNIQUE_PO_NUMBER_UNSET Event', () => {
      it('Test success scenario', () => {
        const aggregate: any = {
          last_sequence_id: 1
        };
        const event = new EventStore({
          type: EventsEnum.AGENCY_CLIENT_REQUIRES_UNIQUE_PO_NUMBER_UNSET,
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
          EventsEnum.AGENCY_CLIENT_REQUIRES_UNIQUE_PO_NUMBER_UNSET,
          aggregate,
          event
        );

        result.requires_unique_po_number.should.be.false;
      });
    });

    describe('AGENCY_CLIENT_REQUIRES_BOOKING_PASSWORD_SET Event', () => {
      it('Test success scenario', () => {
        const aggregate: any = {
          last_sequence_id: 1
        };
        const event = new EventStore({
          type: EventsEnum.AGENCY_CLIENT_REQUIRES_BOOKING_PASSWORD_SET,
          aggregate_id: {},
          data: payload,
          sequence_id: 1,
          meta_data: {
            user_id: 'fake_user'
          },
          correlation_id: 'fake_id',
          created_at: date
        });

        const result = projectionHandler.execute(
          EventsEnum.AGENCY_CLIENT_REQUIRES_BOOKING_PASSWORD_SET,
          aggregate,
          event
        );

        result.requires_booking_password.should.be.true;
        result.booking_passwords.should.be.equal(payload.booking_passwords);
      });
    });

    describe('AGENCY_CLIENT_REQUIRES_BOOKING_PASSWORD_UNSET Event', () => {
      it('Test success scenario', () => {
        const aggregate: any = {
          last_sequence_id: 1
        };
        const event = new EventStore({
          type: EventsEnum.AGENCY_CLIENT_REQUIRES_BOOKING_PASSWORD_UNSET,
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
          EventsEnum.AGENCY_CLIENT_REQUIRES_BOOKING_PASSWORD_UNSET,
          aggregate,
          event
        );

        result.requires_booking_password.should.be.false;
      });
    });

    describe('AGENCY_CLIENT_BOOKING_PASSWORDS_UPDATED Event', () => {
      it('Test success scenario', () => {
        const aggregate: any = {
          last_sequence_id: 1
        };
        const event = new EventStore({
          type: EventsEnum.AGENCY_CLIENT_BOOKING_PASSWORDS_UPDATED,
          aggregate_id: {},
          data: payload,
          sequence_id: 1,
          meta_data: {
            user_id: 'fake_user'
          },
          correlation_id: 'fake_id',
          created_at: date
        });

        const result = projectionHandler.execute(EventsEnum.AGENCY_CLIENT_BOOKING_PASSWORDS_UPDATED, aggregate, event);

        result.booking_passwords.should.be.equal(payload.booking_passwords);
      });
    });

    describe('AGENCY_CLIENT_REQUIRES_SHIFT_REF_NUMBER_SET Event', () => {
      it('Test success scenario', () => {
        const aggregate: any = {
          last_sequence_id: 1
        };
        const event = new EventStore({
          type: EventsEnum.AGENCY_CLIENT_REQUIRES_SHIFT_REF_NUMBER_SET,
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
          EventsEnum.AGENCY_CLIENT_REQUIRES_SHIFT_REF_NUMBER_SET,
          aggregate,
          event
        );

        result.requires_shift_ref_number.should.be.true;
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
