import {RuntimeError} from 'a24-node-error-utils';
import {assert} from 'chai';
import sinon from 'ts-sinon';
import {EventsEnum} from '../../../src/Events';
import {EventStoreCacheHelper} from '../../../src/helpers/EventStoreCacheHelper';
import {
  AgencyClientFinancialHoldAppliedEventHandler,
  AgencyClientFinancialHoldInheritedEventHandler,
  AgencyClientClearFinancialHoldInheritedEventHandler,
  AgencyClientFinancialHoldClearedEventHandler,
  AgencyClientEmptyFinancialHoldInheritedEventHandler
} from '../../../src/projections/AgencyClientFinancialHoldsProjectionV1/event-handlers';

import {EventHandlerFactory} from '../../../src/projections/AgencyClientFinancialHoldsProjectionV1/EventHandlerFactory';
import {TestUtilsLogger} from '../../tools/TestUtilsLogger';

describe('EventHandlerFactory', () => {
  describe('getHandler()', () => {
    it('Test AGENCY_CLIENT_FINANCIAL_HOLD_APPLIED', () => {
      EventHandlerFactory.getHandler(
        EventsEnum.AGENCY_CLIENT_FINANCIAL_HOLD_APPLIED,
        TestUtilsLogger.getLogger(sinon.spy()),
        new EventStoreCacheHelper('1m', 10)
      ).should.be.instanceof(AgencyClientFinancialHoldAppliedEventHandler);
    });

    it('Test AGENCY_CLIENT_FINANCIAL_HOLD_INHERITED', () => {
      EventHandlerFactory.getHandler(
        EventsEnum.AGENCY_CLIENT_FINANCIAL_HOLD_INHERITED,
        TestUtilsLogger.getLogger(sinon.spy()),
        new EventStoreCacheHelper('1m', 10)
      ).should.be.instanceof(AgencyClientFinancialHoldInheritedEventHandler);
    });

    it('Test AGENCY_CLIENT_CLEAR_FINANCIAL_HOLD_INHERITED', () => {
      EventHandlerFactory.getHandler(
        EventsEnum.AGENCY_CLIENT_CLEAR_FINANCIAL_HOLD_INHERITED,
        TestUtilsLogger.getLogger(sinon.spy()),
        new EventStoreCacheHelper('1m', 10)
      ).should.be.instanceof(AgencyClientClearFinancialHoldInheritedEventHandler);
    });

    it('Test AGENCY_CLIENT_EMPTY_FINANCIAL_HOLD_INHERITED', () => {
      EventHandlerFactory.getHandler(
        EventsEnum.AGENCY_CLIENT_EMPTY_FINANCIAL_HOLD_INHERITED,
        TestUtilsLogger.getLogger(sinon.spy()),
        new EventStoreCacheHelper('1m', 10)
      ).should.be.instanceof(AgencyClientEmptyFinancialHoldInheritedEventHandler);
    });

    it('Test AGENCY_CLIENT_FINANCIAL_HOLD_CLEARED', () => {
      EventHandlerFactory.getHandler(
        EventsEnum.AGENCY_CLIENT_FINANCIAL_HOLD_CLEARED,
        TestUtilsLogger.getLogger(sinon.spy()),
        new EventStoreCacheHelper('1m', 10)
      ).should.be.instanceof(AgencyClientFinancialHoldClearedEventHandler);
    });

    it('Test unknown event', () => {
      assert.throws(() => {
        EventHandlerFactory.getHandler(
          'sample' as any,
          TestUtilsLogger.getLogger(sinon.spy()),
          new EventStoreCacheHelper('1m', 10)
        );
      }, RuntimeError);
    });
  });
});
