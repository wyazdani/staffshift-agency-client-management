import {RuntimeError} from 'a24-node-error-utils';
import sinon, {stubInterface} from 'ts-sinon';
import {AgencyClientLinkedEventHandler} from '../../../src/event-store-listeners/FinancialHoldAgencyClientLink/event-handlers/AgencyClientLinkedEventHandler';
import {AgencyClientSyncedEventHandler} from '../../../src/event-store-listeners/FinancialHoldAgencyClientLink/event-handlers/AgencyClientSyncedEventHandler';
import {EventHandlerFactory} from '../../../src/event-store-listeners/FinancialHoldAgencyClientLink/EventHandlerFactory';
import {EventRepository} from '../../../src/EventRepository';
import {EventsEnum} from '../../../src/Events';
import {TestUtilsLogger} from '../../tools/TestUtilsLogger';

describe('EventHandlerFactory', () => {
  afterEach(() => {
    sinon.restore();
  });
  describe('getHandler', () => {
    it('Test AGENCY_CLIENT_LINKED', () => {
      const logger = TestUtilsLogger.getLogger(sinon.spy());
      const eventRepository = stubInterface<EventRepository>();
      const handler = EventHandlerFactory.getHandler(EventsEnum.AGENCY_CLIENT_LINKED, logger, eventRepository);

      handler.should.be.instanceof(AgencyClientLinkedEventHandler);
    });

    it('Test AGENCY_CLIENT_SYNCED', () => {
      const logger = TestUtilsLogger.getLogger(sinon.spy());
      const eventRepository = stubInterface<EventRepository>();
      const handler = EventHandlerFactory.getHandler(EventsEnum.AGENCY_CLIENT_SYNCED, logger, eventRepository);

      handler.should.be.instanceof(AgencyClientSyncedEventHandler);
    });

    it('Test error for unknown event', () => {
      const logger = TestUtilsLogger.getLogger(sinon.spy());
      const eventRepository = stubInterface<EventRepository>();

      (() => {
        EventHandlerFactory.getHandler('sample' as any, logger, eventRepository);
      }).should.throw(RuntimeError);
    });
  });
});
