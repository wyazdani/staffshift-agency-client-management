import sinon, {stubConstructor} from 'ts-sinon';
import {AgencyClientConsultantProjectionTransformer} from '../../../../src/streaming_applications/AgencyClientConsultantProjection/transformers/AgencyClientConsultantProjectionTransformer';
import {assert} from 'chai';
import {LoggerContext} from 'a24-logzio-winston';
import {TestUtilsLogger} from '../../../tools/TestUtilsLogger';
import {EventRepository} from '../../../../src/EventRepository';
import {EventHandlerFactory} from '../../../../src/streaming_applications/AgencyClientConsultantProjection/factories/EventHandlerFactory';
import {AgencyClientConsultantAssignedEventHandler} from '../../../../src/streaming_applications/AgencyClientConsultantProjection/event-handlers/AgencyClientConsultantAssignedEventHandler';
import {PassThrough} from 'stream';
import {AgencyClientConsultantUnassignedEventHandler} from '../../../../src/streaming_applications/AgencyClientConsultantProjection/event-handlers/AgencyClientConsultantUnassignedEventHandler';
import {AgencyConsultantRoleDetailsUpdatedEventHandler} from '../../../../src/streaming_applications/AgencyClientConsultantProjection/event-handlers/AgencyConsultantRoleDetailsUpdatedEventHandler';
import {EventsEnum} from '../../../../src/Events';

describe('AgencyClientConsultantProjectionTransformer', () => {
  let logger: LoggerContext;

  beforeEach(() => {
    logger = TestUtilsLogger.getLogger(sinon.spy());
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('_transform', () => {
    it('should not call event handler for unsupported event', (done) => {
      const data = {
        event: {
          type: 'unknown'
        }
      };
      const options = {
        logger,
        objectMode: true,
        highWaterMark: 1,
        eventRepository: stubConstructor(EventRepository)
      };
      const inputStream = new PassThrough(options);
      const outputStream = new PassThrough(options);
      const transformStream = new AgencyClientConsultantProjectionTransformer(options);
      const handlerStub = stubConstructor(AgencyClientConsultantAssignedEventHandler);
      const getHandlerStub = sinon.stub(EventHandlerFactory, 'getHandler');
      let outputCount = 0;

      getHandlerStub.returns(handlerStub);
      handlerStub.handle.resolves();
      inputStream.pipe(transformStream).pipe(outputStream);
      outputStream.on('data', (streamOutput) => {
        assert.deepEqual(streamOutput, data, 'stream output does not match expected data');
        outputCount++;
      });

      outputStream.on('end', () => {
        assert.equal(outputCount, 1, 'Expected to have only one input');
        assert.equal(handlerStub.handle.callCount, 0, 'Event handler should not have been called');
        done();
      });

      inputStream.write(data);
      inputStream.end();
    });

    it('should call correct event handler for supported event: AgencyClientConsultantAssigned', (done) => {
      const data = {
        event: {
          type: EventsEnum.AGENCY_CLIENT_CONSULTANT_ASSIGNED
        }
      };
      const options = {
        logger,
        objectMode: true,
        highWaterMark: 1,
        eventRepository: stubConstructor(EventRepository)
      };
      const inputStream = new PassThrough(options);
      const outputStream = new PassThrough(options);
      const transformStream = new AgencyClientConsultantProjectionTransformer(options);
      const handlerStub = stubConstructor(AgencyClientConsultantAssignedEventHandler);
      const getHandlerStub = sinon.stub(EventHandlerFactory, 'getHandler');
      let outputCount = 0;

      getHandlerStub.returns(handlerStub);
      handlerStub.handle.resolves();
      inputStream.pipe(transformStream).pipe(outputStream);
      outputStream.on('data', (streamOutput) => {
        assert.deepEqual(streamOutput, data, 'stream output does not match expected data');
        outputCount++;
      });

      outputStream.on('end', () => {
        assert.equal(outputCount, 1, 'Expected to have only one input');
        assert.equal(handlerStub.handle.callCount, 1, 'Correct handler was used to handle the event');
        done();
      });

      inputStream.write(data);
      inputStream.end();
    });

    it('should call correct event handler for supported event: AgencyClientConsultantUnassigned', (done) => {
      const data = {
        event: {
          type: EventsEnum.AGENCY_CLIENT_CONSULTANT_UNASSIGNED
        }
      };
      const options = {
        logger,
        objectMode: true,
        highWaterMark: 1,
        eventRepository: stubConstructor(EventRepository)
      };
      const inputStream = new PassThrough(options);
      const outputStream = new PassThrough(options);
      const transformStream = new AgencyClientConsultantProjectionTransformer(options);
      const handlerStub = stubConstructor(AgencyClientConsultantUnassignedEventHandler);
      const getHandlerStub = sinon.stub(EventHandlerFactory, 'getHandler');
      let outputCount = 0;

      getHandlerStub.returns(handlerStub);
      handlerStub.handle.resolves();
      inputStream.pipe(transformStream).pipe(outputStream);
      outputStream.on('data', (streamOutput) => {
        assert.deepEqual(streamOutput, data, 'stream output does not match expected data');
        outputCount++;
      });

      outputStream.on('end', () => {
        assert.equal(outputCount, 1, 'Expected to have only one input');
        assert.equal(handlerStub.handle.callCount, 1, 'Correct handler was used to handle the event');
        done();
      });

      inputStream.write(data);
      inputStream.end();
    });

    it('should call correct event handler for supported event: AgencyConsultantRoleDetailsUpdated', (done) => {
      const data = {
        event: {
          type: EventsEnum.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED
        }
      };
      const options = {
        logger,
        objectMode: true,
        highWaterMark: 1,
        eventRepository: stubConstructor(EventRepository)
      };
      const inputStream = new PassThrough(options);
      const outputStream = new PassThrough(options);
      const transformStream = new AgencyClientConsultantProjectionTransformer(options);
      const handlerStub = stubConstructor(AgencyConsultantRoleDetailsUpdatedEventHandler);
      const getHandlerStub = sinon.stub(EventHandlerFactory, 'getHandler');
      let outputCount = 0;

      getHandlerStub.returns(handlerStub);
      handlerStub.handle.resolves();
      inputStream.pipe(transformStream).pipe(outputStream);
      outputStream.on('data', (streamOutput) => {
        assert.deepEqual(streamOutput, data, 'stream output does not match expected data');
        outputCount++;
      });

      outputStream.on('end', () => {
        assert.equal(outputCount, 1, 'Expected to have only one input');
        assert.equal(handlerStub.handle.callCount, 1, 'Correct handler was used to handle the event');
        done();
      });

      inputStream.write(data);
      inputStream.end();
    });
  });
});
