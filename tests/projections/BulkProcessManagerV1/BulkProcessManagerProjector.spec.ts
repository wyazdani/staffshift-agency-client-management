import {EventStorePubSubModelInterface} from 'ss-eventstore';
import sinon, {stubInterface} from 'ts-sinon';
import {EventsEnum} from '../../../src/Events';
import BulkProcessManagerProjector from '../../../src/projections/BulkProcessManagerV1/BulkProcessManagerProjector';
import {EventHandlerFactory} from '../../../src/projections/BulkProcessManagerV1/EventHandlerFactory';
import {EventHandlerInterface} from '../../../src/types/EventHandlerInterface';
import {TestUtilsLogger} from '../../tools/TestUtilsLogger';

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

    it('Test CONSULTANT_JOB_ASSIGN_INITIATED', async () => {
      const event: any = {
        type: EventsEnum.CONSULTANT_JOB_ASSIGN_INITIATED
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
    it('Test CONSULTANT_JOB_ASSIGN_COMPLETED', async () => {
      const event: any = {
        type: EventsEnum.CONSULTANT_JOB_ASSIGN_COMPLETED
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

    it('Test rejects the promis in case of error', async () => {
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