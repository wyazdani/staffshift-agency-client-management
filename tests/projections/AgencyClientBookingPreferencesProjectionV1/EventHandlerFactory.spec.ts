import {RuntimeError} from 'a24-node-error-utils';
import {assert} from 'chai';
import sinon from 'ts-sinon';
import {EventsEnum} from '../../../src/Events';
import {
  AgencyClientBookingPasswordsUpdatedEventHandler,
  AgencyClientRequiresBookingPasswordSetEventHandler,
  AgencyClientRequiresBookingPasswordUnsetEventHandler,
  AgencyClientRequiresPONumberSetEventHandler,
  AgencyClientRequiresPONumberUnsetEventHandler,
  AgencyClientRequiresShiftRefNumberSetEventHandler,
  AgencyClientRequiresShiftRefNumberUnsetEventHandler,
  AgencyClientRequiresUniquePONumberSetEventHandler,
  AgencyClientRequiresUniquePONumberUnsetEventHandler
} from '../../../src/projections/AgencyClientBookingPreferencesProjectionV1/event-handlers';

import {EventHandlerFactory} from '../../../src/projections/AgencyClientBookingPreferencesProjectionV1/EventHandlerFactory';
import {TestUtilsLogger} from '../../tools/TestUtilsLogger';

describe('EventHandlerFactory', () => {
  describe('getHandler()', () => {
    it('Test AGENCY_CLIENT_REQUIRES_PO_NUMBER_SET', () => {
      EventHandlerFactory.getHandler(
        EventsEnum.AGENCY_CLIENT_REQUIRES_PO_NUMBER_SET,
        TestUtilsLogger.getLogger(sinon.spy())
      ).should.be.instanceof(AgencyClientRequiresPONumberSetEventHandler);
    });

    it('Test AGENCY_CLIENT_REQUIRES_PO_NUMBER_UNSET', () => {
      EventHandlerFactory.getHandler(
        EventsEnum.AGENCY_CLIENT_REQUIRES_PO_NUMBER_UNSET,
        TestUtilsLogger.getLogger(sinon.spy())
      ).should.be.instanceof(AgencyClientRequiresPONumberUnsetEventHandler);
    });

    it('Test AGENCY_CLIENT_REQUIRES_UNIQUE_PO_NUMBER_SET', () => {
      EventHandlerFactory.getHandler(
        EventsEnum.AGENCY_CLIENT_REQUIRES_UNIQUE_PO_NUMBER_SET,
        TestUtilsLogger.getLogger(sinon.spy())
      ).should.be.instanceof(AgencyClientRequiresUniquePONumberSetEventHandler);
    });

    it('Test AGENCY_CLIENT_REQUIRES_UNIQUE_PO_NUMBER_UNSET', () => {
      EventHandlerFactory.getHandler(
        EventsEnum.AGENCY_CLIENT_REQUIRES_UNIQUE_PO_NUMBER_UNSET,
        TestUtilsLogger.getLogger(sinon.spy())
      ).should.be.instanceof(AgencyClientRequiresUniquePONumberUnsetEventHandler);
    });

    it('Test AGENCY_CLIENT_REQUIRES_BOOKING_PASSWORD_SET', () => {
      EventHandlerFactory.getHandler(
        EventsEnum.AGENCY_CLIENT_REQUIRES_BOOKING_PASSWORD_SET,
        TestUtilsLogger.getLogger(sinon.spy())
      ).should.be.instanceof(AgencyClientRequiresBookingPasswordSetEventHandler);
    });

    it('Test AGENCY_CLIENT_REQUIRES_BOOKING_PASSWORD_UNSET', () => {
      EventHandlerFactory.getHandler(
        EventsEnum.AGENCY_CLIENT_REQUIRES_BOOKING_PASSWORD_UNSET,
        TestUtilsLogger.getLogger(sinon.spy())
      ).should.be.instanceof(AgencyClientRequiresBookingPasswordUnsetEventHandler);
    });

    it('Test AGENCY_CLIENT_BOOKING_PASSWORDS_UPDATED', () => {
      EventHandlerFactory.getHandler(
        EventsEnum.AGENCY_CLIENT_BOOKING_PASSWORDS_UPDATED,
        TestUtilsLogger.getLogger(sinon.spy())
      ).should.be.instanceof(AgencyClientBookingPasswordsUpdatedEventHandler);
    });

    it('Test AGENCY_CLIENT_REQUIRES_SHIFT_REF_NUMBER_SET', () => {
      EventHandlerFactory.getHandler(
        EventsEnum.AGENCY_CLIENT_REQUIRES_SHIFT_REF_NUMBER_SET,
        TestUtilsLogger.getLogger(sinon.spy())
      ).should.be.instanceof(AgencyClientRequiresShiftRefNumberSetEventHandler);
    });

    it('Test AGENCY_CLIENT_REQUIRES_SHIFT_REF_NUMBER_UNSET', () => {
      EventHandlerFactory.getHandler(
        EventsEnum.AGENCY_CLIENT_REQUIRES_SHIFT_REF_NUMBER_UNSET,
        TestUtilsLogger.getLogger(sinon.spy())
      ).should.be.instanceof(AgencyClientRequiresShiftRefNumberUnsetEventHandler);
    });

    it('Test unknown event', () => {
      assert.throws(() => {
        EventHandlerFactory.getHandler('sample' as any, TestUtilsLogger.getLogger(sinon.spy()));
      }, RuntimeError);
    });
  });
});
