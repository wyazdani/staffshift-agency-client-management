import sinon, {stubInterface} from 'ts-sinon';
import {EventsEnum} from '../../../src/Events';
import AgencyClientFinancialHoldsProjector from '../../../src/projections/AgencyClientFinancialHoldsProjectionV1/AgencyClientFinancialHoldsProjector';
import {EventHandlerFactory} from '../../../src/projections/AgencyClientFinancialHoldsProjectionV1/EventHandlerFactory';
import {EventHandlerInterface} from '../../../src/types/EventHandlerInterface';
import {AgencyClientFinancialHoldAppliedEventStoreDataInterface} from '../../../src/types/EventTypes/AgencyClientFinancialHoldAppliedEventInterface';
import {TestUtilsLogger} from '../../tools/TestUtilsLogger';

const events = [
  EventsEnum.AGENCY_CLIENT_FINANCIAL_HOLD_APPLIED,
  EventsEnum.AGENCY_CLIENT_FINANCIAL_HOLD_CLEARED,
  EventsEnum.AGENCY_CLIENT_FINANCIAL_HOLD_INHERITED,
  EventsEnum.AGENCY_CLIENT_CLEAR_FINANCIAL_HOLD_INHERITED,
  EventsEnum.AGENCY_CLIENT_EMPTY_FINANCIAL_HOLD_INHERITED
];

describe('AgencyClientFinancialHoldsProjector', () => {
  afterEach(() => {
    sinon.restore();
  });
  describe('project()', () => {
    for (const eventType of events) {
      it(`Test ${eventType}`, async () => {
        const handler = stubInterface<EventHandlerInterface<AgencyClientFinancialHoldAppliedEventStoreDataInterface>>();
        const event: any = {sample: 'my event', type: eventType};
        const getHandler = sinon.stub(EventHandlerFactory, 'getHandler').returns(handler);

        handler.handle.resolves();
        const projector = new AgencyClientFinancialHoldsProjector();

        await projector.project(TestUtilsLogger.getLogger(sinon.spy()), event);
        handler.handle.should.have.been.calledOnceWith(event);
        getHandler.getCall(0).args[0].should.equal(eventType);
        getHandler.should.have.been.calledOnce;
      });
    }

    it('Test ignoring the event', async () => {
      const event: any = {sample: 'my event', type: 'sample'};
      const getHandler = sinon.stub(EventHandlerFactory, 'getHandler');
      const projector = new AgencyClientFinancialHoldsProjector();

      await projector.project(TestUtilsLogger.getLogger(sinon.spy()), event);
      getHandler.should.not.have.been.called;
    });
  });
});
