import {RuntimeError} from 'a24-node-error-utils';
import {assert} from 'chai';
import sinon from 'ts-sinon';
import {EventsEnum} from '../../../src/Events';
import {EventStoreCacheHelper} from '../../../src/helpers/EventStoreCacheHelper';
import {AgencyClientCreditPaymentTermAppliedEventHandler} from '../../../src/projections/AgencyClientPaymentTermsProjectionV1/event-handlers/AgencyClientCreditPaymentTermAppliedEventHandler';
import {AgencyClientCreditPaymentTermInheritedEventHandler} from '../../../src/projections/AgencyClientPaymentTermsProjectionV1/event-handlers/AgencyClientCreditPaymentTermInheritedEventHandler';
import {AgencyClientEmptyPaymentTermInheritedEventHandler} from '../../../src/projections/AgencyClientPaymentTermsProjectionV1/event-handlers/AgencyClientEmptyPaymentTermInheritedEventHandler';
import {AgencyClientPayInAdvancePaymentTermAppliedEventHandler} from '../../../src/projections/AgencyClientPaymentTermsProjectionV1/event-handlers/AgencyClientPayInAdvancePaymentTermAppliedEventHandler';
import {AgencyClientPayInAdvancePaymentTermInheritedEventHandler} from '../../../src/projections/AgencyClientPaymentTermsProjectionV1/event-handlers/AgencyClientPayInAdvancePaymentTermInheritedEventHandler';
import {EventHandlerFactory} from '../../../src/projections/AgencyClientPaymentTermsProjectionV1/EventHandlerFactory';
import {TestUtilsLogger} from '../../tools/TestUtilsLogger';

describe('EventHandlerFactory', () => {
  describe('getHandler()', () => {
    it('Test AGENCY_CLIENT_CREDIT_PAYMENT_TERM_APPLIED', () => {
      EventHandlerFactory.getHandler(
        EventsEnum.AGENCY_CLIENT_CREDIT_PAYMENT_TERM_APPLIED,
        TestUtilsLogger.getLogger(sinon.spy()),
        new EventStoreCacheHelper('1m')
      ).should.be.instanceof(AgencyClientCreditPaymentTermAppliedEventHandler);
    });

    it('Test AGENCY_CLIENT_CREDIT_PAYMENT_TERM_INHERITED', () => {
      EventHandlerFactory.getHandler(
        EventsEnum.AGENCY_CLIENT_CREDIT_PAYMENT_TERM_INHERITED,
        TestUtilsLogger.getLogger(sinon.spy()),
        new EventStoreCacheHelper('1m')
      ).should.be.instanceof(AgencyClientCreditPaymentTermInheritedEventHandler);
    });

    it('Test AGENCY_CLIENT_PAY_IN_ADVANCE_PAYMENT_TERM_APPLIED', () => {
      EventHandlerFactory.getHandler(
        EventsEnum.AGENCY_CLIENT_PAY_IN_ADVANCE_PAYMENT_TERM_APPLIED,
        TestUtilsLogger.getLogger(sinon.spy()),
        new EventStoreCacheHelper('1m')
      ).should.be.instanceof(AgencyClientPayInAdvancePaymentTermAppliedEventHandler);
    });

    it('Test AGENCY_CLIENT_PAY_IN_ADVANCE_PAYMENT_TERM_INHERITED', () => {
      EventHandlerFactory.getHandler(
        EventsEnum.AGENCY_CLIENT_PAY_IN_ADVANCE_PAYMENT_TERM_INHERITED,
        TestUtilsLogger.getLogger(sinon.spy()),
        new EventStoreCacheHelper('1m')
      ).should.be.instanceof(AgencyClientPayInAdvancePaymentTermInheritedEventHandler);
    });

    it('Test AGENCY_CLIENT_EMPTY_PAYMENT_TERM_INHERITED', () => {
      EventHandlerFactory.getHandler(
        EventsEnum.AGENCY_CLIENT_EMPTY_PAYMENT_TERM_INHERITED,
        TestUtilsLogger.getLogger(sinon.spy()),
        new EventStoreCacheHelper('1m')
      ).should.be.instanceof(AgencyClientEmptyPaymentTermInheritedEventHandler);
    });

    it('Test unknown event', () => {
      assert.throws(() => {
        EventHandlerFactory.getHandler(
          'sample' as any,
          TestUtilsLogger.getLogger(sinon.spy()),
          new EventStoreCacheHelper('1m')
        );
      }, RuntimeError);
    });
  });
});
