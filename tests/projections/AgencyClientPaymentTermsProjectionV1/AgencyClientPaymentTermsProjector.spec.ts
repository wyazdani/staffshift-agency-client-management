import sinon, {stubInterface} from 'ts-sinon';
import {EventsEnum} from '../../../src/Events';
import AgencyClientPaymentTermsProjector from '../../../src/projections/AgencyClientPaymentTermsProjectionV1/AgencyClientPaymentTermsProjector';
import {EventHandlerFactory} from '../../../src/projections/AgencyClientPaymentTermsProjectionV1/EventHandlerFactory';
import {EventHandlerInterface} from '../../../src/types/EventHandlerInterface';
import {AgencyClientCreditPaymentTermAppliedEventStoreDataInterface} from '../../../src/types/EventTypes';
import {TestUtilsLogger} from '../../tools/TestUtilsLogger';

const events = [
  EventsEnum.AGENCY_CLIENT_CREDIT_PAYMENT_TERM_APPLIED,
  EventsEnum.AGENCY_CLIENT_CREDIT_PAYMENT_TERM_INHERITED,
  EventsEnum.AGENCY_CLIENT_PAY_IN_ADVANCE_PAYMENT_TERM_APPLIED,
  EventsEnum.AGENCY_CLIENT_PAY_IN_ADVANCE_PAYMENT_TERM_INHERITED,
  EventsEnum.AGENCY_CLIENT_EMPTY_PAYMENT_TERM_INHERITED
];

describe('AgencyClientPaymentTermsProjector', () => {
  afterEach(() => {
    sinon.restore();
  });
  describe('onEvent()', () => {
    for (const eventType of events) {
      it(`Test ${eventType}`, async () => {
        const handler =
          stubInterface<EventHandlerInterface<AgencyClientCreditPaymentTermAppliedEventStoreDataInterface>>();
        const event: any = {sample: 'my event', type: eventType};
        const getHandler = sinon.stub(EventHandlerFactory, 'getHandler').returns(handler);

        handler.handle.resolves();
        const projector = new AgencyClientPaymentTermsProjector();

        await projector.onEvent(TestUtilsLogger.getLogger(sinon.spy()), event);
        handler.handle.should.have.been.calledOnceWith(event);
        getHandler.getCall(0).args[0].should.equal(eventType);
        getHandler.should.have.been.calledOnce;
      });
    }

    it('Test ignoring the event', async () => {
      const event: any = {sample: 'my event', type: 'sample'};
      const getHandler = sinon.stub(EventHandlerFactory, 'getHandler');
      const projector = new AgencyClientPaymentTermsProjector();

      await projector.onEvent(TestUtilsLogger.getLogger(sinon.spy()), event);
      getHandler.should.not.have.been.called;
    });
  });
});
