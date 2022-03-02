import sinon from 'ts-sinon';
import {EventsEnum} from '../../../src/Events';
import {ConsultantJobAssignCompletedEventHandler} from '../../../src/projections/BulkProcessManagerV1/event-handlers/ConsultantJobAssignCompletedEventHandler';
import {ConsultantJobAssignInitiatedEventHandler} from '../../../src/projections/BulkProcessManagerV1/event-handlers/ConsultantJobAssignInitiatedEventHandler';
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

      handler.should.instanceof(ConsultantJobAssignInitiatedEventHandler);
    });

    it('Test CONSULTANT_JOB_ASSIGN_COMPLETED', () => {
      const logger = TestUtilsLogger.getLogger(sinon.spy());
      const handler = EventHandlerFactory.getHandler(EventsEnum.CONSULTANT_JOB_ASSIGN_COMPLETED, logger);

      handler.should.instanceof(ConsultantJobAssignCompletedEventHandler);
    });

    it('Test error for unknown event', () => {
      const logger = TestUtilsLogger.getLogger(sinon.spy());

      (() => {
        EventHandlerFactory.getHandler(EventsEnum.AGENCY_CLIENT_LINKED, logger);
      }).should.throw(Error);
    });
  });
});
