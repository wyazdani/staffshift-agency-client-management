import {EventHandlerFactory} from '../../../../src/projections/AgencyClientConsultantsV3/factories/EventHandlerFactory';
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

describe('EventHandlerFactory', () => {
  let testLogger: LoggerContext;

  beforeEach(() => {
    testLogger = TestUtilsLogger.getLogger(sinon.spy());
  });
  afterEach(() => {
    sinon.restore();
  });

  describe('getHandler()', () => {
    it('should return correct handler for AgencyClientConsultantAssigned event', () => {
      const eventType = EventsEnum.AGENCY_CLIENT_CONSULTANT_ASSIGNED;
      const eventRepository = stubConstructor(EventRepository);
      const handler = EventHandlerFactory.getHandler(eventType, eventRepository, testLogger);

      handler.should.be.instanceof(AgencyClientConsultantAssignedEventHandler);
      assert.instanceOf(handler, AgencyClientConsultantAssignedEventHandler);
    });

    it('should return correct handler for AgencyClientConsultantUnassigned event', () => {
      const eventType = EventsEnum.AGENCY_CLIENT_CONSULTANT_UNASSIGNED;
      const eventRepository = stubConstructor(EventRepository);
      const handler = EventHandlerFactory.getHandler(eventType, eventRepository, testLogger);

      handler.should.be.instanceof(AgencyClientConsultantUnassignedEventHandler);
      assert.instanceOf(handler, AgencyClientConsultantUnassignedEventHandler);
    });

    it('should return correct handler for AgencyConsultantRoleDetailsUpdated event', () => {
      const eventType = EventsEnum.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED;
      const eventRepository = stubConstructor(EventRepository);
      const handler = EventHandlerFactory.getHandler(eventType, eventRepository, testLogger);

      handler.should.be.instanceof(AgencyConsultantRoleDetailsUpdatedEventHandler);
      assert.instanceOf(handler, AgencyConsultantRoleDetailsUpdatedEventHandler);
    });

    it('should throw error if event is not supported', () => {
      const eventType = 'weird-event';
      const eventRepository = stubConstructor(EventRepository);
      const test = () => EventHandlerFactory.getHandler(eventType as EventsEnum, eventRepository, testLogger);

      expect(test).to.throw(Error, `No configured handler found for this event: ${eventType}`);
    });
  });
});
