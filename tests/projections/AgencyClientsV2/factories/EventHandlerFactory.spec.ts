import {EventHandlerFactory} from '../../../../src/projections/AgencyClientsV2/factories/EventHandlerFactory';
import {EventRepository} from '../../../../src/EventRepository';
import sinon, {stubConstructor} from 'ts-sinon';
import {afterEach} from 'mocha';
import {assert, expect} from 'chai';
import {AgencyClientConsultantAssignedEventHandler} from '../../../../src/projections/AgencyClientConsultantsV3/event-handlers/AgencyClientConsultantAssignedEventHandler';
import {TestUtilsLogger} from '../../../tools/TestUtilsLogger';
import {LoggerContext} from 'a24-logzio-winston';
import {AgencyClientConsultantUnassignedEventHandler} from '../../../../src/projections/AgencyClientConsultantsV3/event-handlers/AgencyClientConsultantUnassignedEventHandler';
import {AgencyConsultantRoleDetailsUpdatedEventHandler} from '../../../../src/projections/AgencyClientConsultantsV3/event-handlers/AgencyConsultantRoleDetailsUpdatedEventHandler';
import {EventsEnum} from '../../../../src/Events';
import {AgencyClientLinkedEventHandler} from '../../../../src/projections/AgencyClientsV2/event-handlers/AgencyClientLinkedEventHandler';
import {AgencyClientUnLinkedEventHandler} from '../../../../src/projections/AgencyClientsV2/event-handlers/AgencyClientUnLinkedEventHandler';
import {AgencyClientSyncedEventHandler} from '../../../../src/projections/AgencyClientsV2/event-handlers/AgencyClientSyncedEventHandler';

describe('EventHandlerFactory', () => {
  let testLogger: LoggerContext;

  beforeEach(() => {
    testLogger = TestUtilsLogger.getLogger(sinon.spy());
  });
  afterEach(() => {
    sinon.restore();
  });

  describe('getHandler()', () => {
    it('should return correct handler for AgencyClientLinked event', () => {
      const eventType = EventsEnum.AGENCY_CLIENT_LINKED;
      const handler = EventHandlerFactory.getHandler(eventType, testLogger);

      assert.isTrue(handler instanceof AgencyClientLinkedEventHandler);
    });

    it('should return correct handler for AgencyClientUnLinked event', () => {
      const eventType = EventsEnum.AGENCY_CLIENT_UNLINKED;
      const handler = EventHandlerFactory.getHandler(eventType, testLogger);

      assert.isTrue(handler instanceof AgencyClientUnLinkedEventHandler);
    });

    it('should return correct handler for AgencyClientSynced event', () => {
      const eventType = EventsEnum.AGENCY_CLIENT_SYNCED;
      const handler = EventHandlerFactory.getHandler(eventType, testLogger);

      assert.isTrue(handler instanceof AgencyClientSyncedEventHandler);
    });

    it('should throw error if event is not supported', () => {
      const eventType = 'weird-event';
      const test = () => EventHandlerFactory.getHandler(eventType as EventsEnum, testLogger);

      expect(test).to.throw(Error, `No configured handler found for this event: ${eventType}`);
    });
  });
});
