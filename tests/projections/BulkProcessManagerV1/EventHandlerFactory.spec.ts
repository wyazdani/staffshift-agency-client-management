import sinon from 'ts-sinon';
import {EventsEnum} from '../../../src/Events';
import {JobCompletedEventHandler} from '../../../src/projections/BulkProcessManagerV1/event-handlers/JobCompletedEventHandler';
import {JobInitiatedEventHandler} from '../../../src/projections/BulkProcessManagerV1/event-handlers/JobInitiatedEventHandler';
import {EventHandlerFactory} from '../../../src/projections/BulkProcessManagerV1/EventHandlerFactory';
import {TestUtilsLogger} from '../../tools/TestUtilsLogger';

describe('EventHandlerFactory', () => {
  afterEach(() => {
    sinon.restore();
  });
  describe('getHandler', () => {
    describe('JobInitiatedEventHandler', () => {
      const initiateEvents = [
        EventsEnum.CONSULTANT_JOB_ASSIGN_INITIATED,
        EventsEnum.CONSULTANT_JOB_UNASSIGN_INITIATED,
        EventsEnum.CONSULTANT_JOB_TRANSFER_INITIATED,
        EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_INHERITANCE_INITIATED,
        EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_INITIATED,
        EventsEnum.AGENCY_CLIENT_APPLY_FINANCIAL_HOLD_INITIATED,
        EventsEnum.AGENCY_CLIENT_CLEAR_FINANCIAL_HOLD_INITIATED,
        EventsEnum.AGENCY_CLIENT_APPLY_FINANCIAL_HOLD_INHERITANCE_INITIATED
      ];

      for (const event of initiateEvents) {
        it(`Test ${event}`, () => {
          const logger = TestUtilsLogger.getLogger(sinon.spy());
          const handler = EventHandlerFactory.getHandler(event, logger);

          handler.should.instanceof(JobInitiatedEventHandler);
        });
      }
    });

    describe('JobCompletedEventHandler', () => {
      const completedEvents = [
        EventsEnum.CONSULTANT_JOB_ASSIGN_COMPLETED,
        EventsEnum.CONSULTANT_JOB_UNASSIGN_COMPLETED,
        EventsEnum.CONSULTANT_JOB_TRANSFER_COMPLETED,
        EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_INHERITANCE_COMPLETED,
        EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_COMPLETED,
        EventsEnum.AGENCY_CLIENT_APPLY_FINANCIAL_HOLD_COMPLETED,
        EventsEnum.AGENCY_CLIENT_CLEAR_FINANCIAL_HOLD_COMPLETED,
        EventsEnum.AGENCY_CLIENT_APPLY_FINANCIAL_HOLD_INHERITANCE_COMPLETED
      ];

      for (const event of completedEvents) {
        it(`Test ${event}`, () => {
          const logger = TestUtilsLogger.getLogger(sinon.spy());
          const handler = EventHandlerFactory.getHandler(event, logger);

          handler.should.instanceof(JobCompletedEventHandler);
        });
      }
    });

    it('Test error for unknown event', () => {
      const logger = TestUtilsLogger.getLogger(sinon.spy());

      (() => {
        EventHandlerFactory.getHandler(EventsEnum.AGENCY_CLIENT_LINKED, logger);
      }).should.throw(Error);
    });
  });
});
