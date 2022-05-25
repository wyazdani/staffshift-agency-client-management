import {EventStorePubSubModelInterface} from 'ss-eventstore';
import sinon, {stubInterface} from 'ts-sinon';
import {EventsEnum} from '../../../src/Events';
import BulkProcessManagerProjector from '../../../src/projections/BulkProcessManagerV1/BulkProcessManagerProjector';
import {EventHandlerFactory} from '../../../src/projections/BulkProcessManagerV1/EventHandlerFactory';
import {EventHandlerInterface} from '../../../src/types/EventHandlerInterface';
import {TestUtilsLogger} from '../../tools/TestUtilsLogger';

const events = [
  EventsEnum.CONSULTANT_JOB_ASSIGN_INITIATED,
  EventsEnum.CONSULTANT_JOB_ASSIGN_COMPLETED,
  EventsEnum.CONSULTANT_JOB_UNASSIGN_INITIATED,
  EventsEnum.CONSULTANT_JOB_UNASSIGN_COMPLETED
];

describe('BulkProcessManagerProjector class', () => {
  afterEach(() => {
    sinon.restore();
  });
  describe('project()', () => {
    it('Test ignore not related events', async () => {
      const getHandler = sinon.stub(EventHandlerFactory, 'getHandler');
      const logger = TestUtilsLogger.getLogger(sinon.spy());
      const projector = new BulkProcessManagerProjector();

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
        const projector = new BulkProcessManagerProjector();

        await projector.project(logger, event);
        getHandler.should.have.been.calledWith(event.type, logger);
        handler.handle.should.have.been.calledWith(event);
      });
    }

    it('Test rejects the promise in case of error', async () => {
      const event: any = {
        type: EventsEnum.CONSULTANT_JOB_ASSIGN_COMPLETED
      };
      const handler = stubInterface<EventHandlerInterface<EventStorePubSubModelInterface>>();
      const error = new Error('sample error');

      handler.handle.rejects(error);
      const getHandler = sinon.stub(EventHandlerFactory, 'getHandler').returns(handler);
      const logger = TestUtilsLogger.getLogger(sinon.spy());
      const projector = new BulkProcessManagerProjector();

      await projector.project(logger, event).should.have.been.rejectedWith(error);
      getHandler.should.have.been.calledWith(event.type, logger);
      handler.handle.should.have.been.calledWith(event);
    });
  });
});
