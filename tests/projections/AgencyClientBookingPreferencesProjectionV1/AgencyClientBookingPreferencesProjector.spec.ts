import sinon, {stubInterface} from 'ts-sinon';
import {EventsEnum} from '../../../src/Events';
import AgencyClientBookingPreferencesProjector from '../../../src/projections/AgencyClientBookingPreferencesProjectionV1/AgencyClientBookingPreferencesProjector';
import {EventHandlerFactory} from '../../../src/projections/AgencyClientBookingPreferencesProjectionV1/EventHandlerFactory';
import {EventHandlerInterface} from '../../../src/types/EventHandlerInterface';
import {AgencyClientRequiresPONumberSetEventStoreDataInterface} from '../../../src/types/EventTypes/AgencyClientRequiresPONumberSetEventInterface';
import {TestUtilsLogger} from '../../tools/TestUtilsLogger';

const events = [
  EventsEnum.AGENCY_CLIENT_REQUIRES_PO_NUMBER_SET,
  EventsEnum.AGENCY_CLIENT_REQUIRES_PO_NUMBER_UNSET,
  EventsEnum.AGENCY_CLIENT_REQUIRES_UNIQUE_PO_NUMBER_SET,
  EventsEnum.AGENCY_CLIENT_REQUIRES_UNIQUE_PO_NUMBER_UNSET,
  EventsEnum.AGENCY_CLIENT_REQUIRES_BOOKING_PASSWORD_SET,
  EventsEnum.AGENCY_CLIENT_REQUIRES_BOOKING_PASSWORD_UNSET,
  EventsEnum.AGENCY_CLIENT_BOOKING_PASSWORDS_UPDATED,
  EventsEnum.AGENCY_CLIENT_REQUIRES_SHIFT_REF_NUMBER_SET,
  EventsEnum.AGENCY_CLIENT_REQUIRES_SHIFT_REF_NUMBER_UNSET
];

describe('AgencyClientBookingPreferencesProjector', () => {
  afterEach(() => {
    sinon.restore();
  });
  describe('project()', () => {
    for (const eventType of events) {
      it(`Test ${eventType}`, async () => {
        const handler = stubInterface<EventHandlerInterface<AgencyClientRequiresPONumberSetEventStoreDataInterface>>();
        const event: any = {sample: 'my event', type: eventType};
        const getHandler = sinon.stub(EventHandlerFactory, 'getHandler').returns(handler);

        handler.handle.resolves();
        const projector = new AgencyClientBookingPreferencesProjector();

        await projector.onEvent(TestUtilsLogger.getLogger(sinon.spy()), event);
        handler.handle.should.have.been.calledOnceWith(event);
        getHandler.should.have.been.calledOnceWith(eventType);
        getHandler.should.have.been.calledOnce;
      });
    }

    it('Test ignoring the event', async () => {
      const event: any = {sample: 'my event', type: 'sample'};
      const getHandler = sinon.stub(EventHandlerFactory, 'getHandler');
      const projector = new AgencyClientBookingPreferencesProjector();

      await projector.onEvent(TestUtilsLogger.getLogger(sinon.spy()), event);
      getHandler.should.not.have.been.called;
    });
  });
});
