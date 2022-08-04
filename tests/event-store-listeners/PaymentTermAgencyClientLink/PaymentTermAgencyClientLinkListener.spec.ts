import {EventStorePubSubModelInterface} from 'ss-eventstore';
import sinon, {stubInterface} from 'ts-sinon';
import {EventHandlerFactory} from '../../../src/event-store-listeners/PaymentTermAgencyClientLink/EventHandlerFactory';
import PaymentTermAgencyClientLinkListener from '../../../src/event-store-listeners/PaymentTermAgencyClientLink/PaymentTermAgencyClientLinkListener';
import {EventRepository} from '../../../src/EventRepository';
import {EventsEnum} from '../../../src/Events';
import {EventHandlerInterface} from '../../../src/types/EventHandlerInterface';
import {TestUtilsLogger} from '../../tools/TestUtilsLogger';

const events = [EventsEnum.AGENCY_CLIENT_LINKED, EventsEnum.AGENCY_CLIENT_SYNCED];

describe('PaymentTermAgencyClientLinkListener class', () => {
  afterEach(() => {
    sinon.restore();
  });
  describe('project()', () => {
    it('Test ignore not related events', async () => {
      const getHandler = sinon.stub(EventHandlerFactory, 'getHandler');
      const logger = TestUtilsLogger.getLogger(sinon.spy());
      const projector = new PaymentTermAgencyClientLinkListener();

      await projector.project(logger, {
        type: 'sample'
      } as any);
      getHandler.should.not.have.been.called;
    });
    for (const eventType of events) {
      it(`Test ${eventType}`, async () => {
        const event: any = {
          type: eventType
        };
        const handler = stubInterface<EventHandlerInterface<EventStorePubSubModelInterface>>();

        handler.handle.resolves();
        const getHandler = sinon.stub(EventHandlerFactory, 'getHandler').returns(handler);
        const logger = TestUtilsLogger.getLogger(sinon.spy());
        const projector = new PaymentTermAgencyClientLinkListener();

        await projector.project(logger, event);
        getHandler.getCall(0).args[0].should.equal(event.type);
        getHandler.getCall(0).args[1].should.equal(logger);
        getHandler.getCall(0).args[2].should.be.instanceOf(EventRepository);
        getHandler.should.have.been.calledOnce;
        handler.handle.should.have.been.calledWith(event);
      });
    }

    it('Test rejects the promise in case of error', async () => {
      const event: any = {
        type: events[0]
      };
      const handler = stubInterface<EventHandlerInterface<EventStorePubSubModelInterface>>();
      const error = new Error('sample error');

      handler.handle.rejects(error);
      const getHandler = sinon.stub(EventHandlerFactory, 'getHandler').returns(handler);
      const logger = TestUtilsLogger.getLogger(sinon.spy());
      const projector = new PaymentTermAgencyClientLinkListener();

      await projector.project(logger, event).should.have.been.rejectedWith(error);
      getHandler.getCall(0).args[0].should.equal(event.type);
      getHandler.getCall(0).args[1].should.equal(logger);
      getHandler.getCall(0).args[2].should.be.instanceOf(EventRepository);
      getHandler.should.have.been.calledOnce;
      handler.handle.should.have.been.calledWith(event);
    });
  });
});
