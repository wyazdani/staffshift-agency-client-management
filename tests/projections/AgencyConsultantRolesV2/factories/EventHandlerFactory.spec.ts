import {EventHandlerFactory} from '../../../../src/projections/AgencyConsultantRolesV2/factories/EventHandlerFactory';
import sinon from 'ts-sinon';
import {afterEach} from 'mocha';
import {assert, expect} from 'chai';
import {TestUtilsLogger} from '../../../tools/TestUtilsLogger';
import {LoggerContext} from 'a24-logzio-winston';
import {EventsEnum} from '../../../../src/Events';
import {AgencyConsultantRoleDetailsUpdatedEventHandler} from '../../../../src/projections/AgencyConsultantRolesV2/event-handlers/AgencyConsultantRoleDetailsUpdatedEventHandler';
import {AgencyConsultantRoleAddedEventHandler} from '../../../../src/projections/AgencyConsultantRolesV2/event-handlers/AgencyConsultantRoleAddedEventHandler';
import {AgencyConsultantRoleEnabledEventHandler} from '../../../../src/projections/AgencyConsultantRolesV2/event-handlers/AgencyConsultantRoleEnabledEventHandler';
import {AgencyConsultantRoleDisabledEventHandler} from '../../../../src/projections/AgencyConsultantRolesV2/event-handlers/AgencyConsultantRoleDisabledEventHandler';

describe('EventHandlerFactory', () => {
  let testLogger: LoggerContext;

  beforeEach(() => {
    testLogger = TestUtilsLogger.getLogger(sinon.spy());
  });
  afterEach(() => {
    sinon.restore();
  });

  describe('getHandler()', () => {
    const event: any = {
      _id: '62bd7a978f7eab2e466a0c18',
      type: 'event_type',
      aggregate_id: {agency_id: '62b44615c008c1df3154501c'},
      data: {
        _id: '62bc58ad371fecc5c10a2614',
        name: 'test',
        description: 'test',
        max_consultants: 2
      },
      sequence_id: 23,
      meta_data: {user_id: '1234567890'},
      correlation_id: '123',
      created_at: '2022-06-30T10:27:35.464Z',
      updated_at: '2022-06-30T10:27:35.464Z'
    };

    it('should return correct handler for AgencyConsultantRoleAdded event', () => {
      const eventType = EventsEnum.AGENCY_CONSULTANT_ROLE_ADDED;

      event.type = eventType;
      const handler = EventHandlerFactory.getHandler(eventType, testLogger);

      handler.should.be.instanceof(AgencyConsultantRoleAddedEventHandler);
      assert.instanceOf(handler, AgencyConsultantRoleAddedEventHandler);
    });

    it('should return correct handler for AgencyConsultantRoleEnabled event', () => {
      const eventType = EventsEnum.AGENCY_CONSULTANT_ROLE_ENABLED;

      event.type = eventType;
      const handler = EventHandlerFactory.getHandler(eventType, testLogger);

      handler.should.be.instanceof(AgencyConsultantRoleEnabledEventHandler);
      assert.instanceOf(handler, AgencyConsultantRoleEnabledEventHandler);
    });

    it('should return correct handler for AgencyConsultantRoleDisabled event', () => {
      const eventType = EventsEnum.AGENCY_CONSULTANT_ROLE_DISABLED;

      event.type = eventType;
      const handler = EventHandlerFactory.getHandler(eventType, testLogger);

      handler.should.be.instanceof(AgencyConsultantRoleDisabledEventHandler);
      assert.instanceOf(handler, AgencyConsultantRoleDisabledEventHandler);
    });

    it('should return correct handler for AgencyConsultantRoleDetailsUpdated event', () => {
      const eventType = EventsEnum.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED;

      event.type = eventType;
      const handler = EventHandlerFactory.getHandler(eventType, testLogger);

      handler.should.be.instanceof(AgencyConsultantRoleDetailsUpdatedEventHandler);
      assert.instanceOf(handler, AgencyConsultantRoleDetailsUpdatedEventHandler);
    });

    it('should throw error if event is not supported', () => {
      const eventType = 'weird-event';

      event.type = eventType;
      const test = () => EventHandlerFactory.getHandler(eventType as EventsEnum, testLogger);

      expect(test).to.throw(Error, `No configured handler found for this event: ${eventType}`);
    });
  });
});
