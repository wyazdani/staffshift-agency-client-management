import sinon from 'ts-sinon';
import {EventsEnum} from '../../../src/Events';
import {ConsultantJobCompletedEventHandler} from '../../../src/projections/BulkProcessManagerV1/event-handlers/ConsultantJobCompletedEventHandler';
import {ConsultantJobInitiatedEventHandler} from '../../../src/projections/BulkProcessManagerV1/event-handlers/ConsultantJobInitiatedEventHandler';
import {EventHandlerFactory} from '../../../src/projections/BulkProcessManagerV1/EventHandlerFactory';
import {TestUtilsLogger} from '../../tools/TestUtilsLogger';

describe('EventHandlerFactory', () => {
  afterEach(() => {
    sinon.restore();
  });
  describe('getHandler', () => {
    it('Test CONSULTANT_JOB_ASSIGN_INITIATED', () => {
      const logger = TestUtilsLogger.getLogger(sinon.spy());
      const handler = EventHandlerFactory.getHandler(EventsEnum.CONSULTANT_JOB_ASSIGN_INITIATED, logger);

      handler.should.instanceof(ConsultantJobInitiatedEventHandler);
    });

    it('Test CONSULTANT_JOB_ASSIGN_COMPLETED', () => {
      const logger = TestUtilsLogger.getLogger(sinon.spy());
      const handler = EventHandlerFactory.getHandler(EventsEnum.CONSULTANT_JOB_ASSIGN_COMPLETED, logger);

      handler.should.instanceof(ConsultantJobCompletedEventHandler);
    });

    it('Test CONSULTANT_JOB_UNASSIGN_INITIATED', () => {
      const logger = TestUtilsLogger.getLogger(sinon.spy());
      const handler = EventHandlerFactory.getHandler(EventsEnum.CONSULTANT_JOB_UNASSIGN_INITIATED, logger);

      handler.should.instanceof(ConsultantJobInitiatedEventHandler);
    });

    it('Test CONSULTANT_JOB_UNASSIGN_COMPLETED', () => {
      const logger = TestUtilsLogger.getLogger(sinon.spy());
      const handler = EventHandlerFactory.getHandler(EventsEnum.CONSULTANT_JOB_UNASSIGN_COMPLETED, logger);

      handler.should.instanceof(ConsultantJobCompletedEventHandler);
    });

    it('Test error for unknown event', () => {
      const logger = TestUtilsLogger.getLogger(sinon.spy());

      (() => {
        EventHandlerFactory.getHandler(EventsEnum.AGENCY_CLIENT_LINKED, logger);
      }).should.throw(Error);
    });
  });
});
