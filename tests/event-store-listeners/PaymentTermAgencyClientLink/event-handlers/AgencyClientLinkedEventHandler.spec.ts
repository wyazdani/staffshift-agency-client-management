import sinon, {stubInterface} from 'ts-sinon';
import {AgencyClientLinkedEventHandler} from '../../../../src/event-store-listeners/PaymentTermAgencyClientLink/event-handlers/AgencyClientLinkedEventHandler';
import {PaymentTermAgencyClientLinkPropagator} from '../../../../src/event-store-listeners/PaymentTermAgencyClientLink/event-handlers/PaymentTermAgencyClientLinkPropagator';
import {EventRepository} from '../../../../src/EventRepository';
import {TestUtilsLogger} from '../../../tools/TestUtilsLogger';

describe('AgencyClientLinkedEventHandler', () => {
  describe('handle()', async () => {
    afterEach(() => sinon.restore());
    it('Test calling propagate', async () => {
      const event: any = {
        aggregate_id: {
          name: 'the name'
        },
        type: 'type sample',
        data: {
          ok: 'oops'
        }
      };
      const propagate = sinon.stub(PaymentTermAgencyClientLinkPropagator.prototype, 'propagate').resolves();
      const handler = new AgencyClientLinkedEventHandler(
        TestUtilsLogger.getLogger(sinon.spy()),
        stubInterface<EventRepository>()
      );

      await handler.handle(event);
      propagate.should.have.been.calledOnceWith(event.aggregate_id, event.data);
    });
  });
});
