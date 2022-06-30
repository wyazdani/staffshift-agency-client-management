import {EventHandlerFactory} from '../../../../src/projections/AgencyConsultantRolesV2/factories/EventHandlerFactory';
import {EventRepository} from '../../../../src/EventRepository';
import sinon, {stubConstructor} from 'ts-sinon';
import {afterEach} from 'mocha';
import {assert, expect} from 'chai';
import {TestUtilsLogger} from '../../../tools/TestUtilsLogger';
import {LoggerContext} from 'a24-logzio-winston';
import {EventsEnum} from '../../../../src/Events';
import {AgencyConsultantRoleDetailsUpdatedEventHandler} from '../../../../src/projections/AgencyConsultantRolesV2/event-handlers/AgencyConsultantRoleDetailsUpdatedEventHandler';
import {AgencyConsultantRoleAddedEventHandler} from '../../../../src/projections/AgencyConsultantRolesV2/event-handlers/AgencyConsultantRoleAddedEventHandler';

describe('EventHandlerFactory', () => {
  let testLogger: LoggerContext;

  beforeEach(() => {
    testLogger = TestUtilsLogger.getLogger(sinon.spy());
  });
  afterEach(() => {
    sinon.restore();
  });

  describe('getHandler()', () => {
    const event = {
      _id: '62bd7a978f7eab2e466a0c18',
      type: 'event_type',
      aggregate_id: {agency_id: '62b44615c008c1df3154501c'},
      data: {_id: '62bc58ad371fecc5c10a2614'},
      sequence_id: 23,
      meta_data: {user_id: '1234567890'},
      correlation_id: '123',
      created_at: '2022-06-30T10:27:35.464Z',
      updated_at: '2022-06-30T10:27:35.464Z'
    };

    it('should return correct handler for AgencyConsultantRoleAdded event', () => {
      const eventType = EventsEnum.AGENCY_CONSULTANT_ROLE_ADDED;

      event.type = eventType;
      const handler = EventHandlerFactory.getHandler(eventType as EventsEnum, testLogger, event);

      assert.isTrue(handler instanceof AgencyConsultantRoleAddedEventHandler);
    });

    it('should return correct handler for AgencyConsultantRoleEnabled event', () => {
      const eventType = EventsEnum.AGENCY_CONSULTANT_ROLE_ENABLED;

      event.type = eventType;
      const handler = EventHandlerFactory.getHandler(eventType as EventsEnum, testLogger, event);

      assert.isTrue(handler instanceof AgencyConsultantRoleDetailsUpdatedEventHandler);
    });

    it('should return correct handler for AgencyConsultantRoleDisabled event', () => {
      const eventType = EventsEnum.AGENCY_CONSULTANT_ROLE_DISABLED;

      event.type = eventType;
      const handler = EventHandlerFactory.getHandler(eventType as EventsEnum, testLogger, event);

      assert.isTrue(handler instanceof AgencyConsultantRoleDetailsUpdatedEventHandler);
    });

    it('should return correct handler for AgencyConsultantRoleDetailsUpdated event', () => {
      const eventType = EventsEnum.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED;

      event.type = eventType;
      const handler = EventHandlerFactory.getHandler(eventType as EventsEnum, testLogger, event);

      assert.isTrue(handler instanceof AgencyConsultantRoleDetailsUpdatedEventHandler);
    });

    it('should throw error if event is not supported', () => {
      const eventType = 'weird-event';

      event.type = eventType;
      const test = () => EventHandlerFactory.getHandler(eventType as EventsEnum, testLogger, event);

      expect(test).to.throw(Error, `No configured handler found for this event: ${eventType}`);
    });
  });
});
