import sinon, {stubInterface} from 'ts-sinon';
import {AgencyClientSyncedEventHandler} from '../../../../src/event-store-listeners/PaymentTermAgencyClientLink/event-handlers/AgencyClientSyncedEventHandler';
import {PaymentTermAgencyClientLinkPropagator} from '../../../../src/event-store-listeners/PaymentTermAgencyClientLink/event-handlers/PaymentTermAgencyClientLinkPropagator';
import {EventRepository} from '../../../../src/EventRepository';
import {TestUtilsLogger} from '../../../tools/TestUtilsLogger';

describe('AgencyClientSyncedEventHandler', () => {
  describe('handle()', async () => {
    afterEach(() => sinon.restore());
    it('Test calling propagate', async () => {
      const event: any = {
        aggregate_id: {
          name: 'the name'
        },
        type: 'type sample',
        data: {
          linked: true
        }
      };
      const propagate = sinon.stub(PaymentTermAgencyClientLinkPropagator.prototype, 'propagate').resolves();
      const handler = new AgencyClientSyncedEventHandler(
        TestUtilsLogger.getLogger(sinon.spy()),
        stubInterface<EventRepository>()
      );

      await handler.handle(event);
      propagate.should.have.been.calledOnceWith(event.aggregate_id, event.data);
    });

    it('Test ignoring the message if client not linked', async () => {
      const event: any = {
        aggregate_id: {
          name: 'the name'
        },
        type: 'type sample',
        data: {
          linked: false
        }
      };
      const propagate = sinon.stub(PaymentTermAgencyClientLinkPropagator.prototype, 'propagate').resolves();
      const handler = new AgencyClientSyncedEventHandler(
        TestUtilsLogger.getLogger(sinon.spy()),
        stubInterface<EventRepository>()
      );

      await handler.handle(event);
      propagate.should.not.have.been.called;
    });
  });
});
