import sinon from 'sinon';
import {assert} from 'chai';
import {LoggerContext} from 'a24-logzio-winston';
import {EventStorePipeline} from '../../../src/streaming_applications/AgencyClientsProjection/EventStorePipeline';
import {TestUtilsLogger} from '../../tools/TestUtilsLogger';
import {AGENCY_CLIENT_MANAGEMENT_DB_KEY} from '../../../src/streaming_applications/DatabaseConfigKeys';
import {stubConstructor} from 'ts-sinon';
import {ResumeTokenCollectionManager} from '../../../src/streaming_applications/core/ResumeTokenCollectionManager';
import {PIPELINE_TYPES_ENUM, STREAM_TYPES_ENUM} from '../../../src/streaming_applications/core/ChangeStreamEnums';
import {MongoClients} from '../../../src/streaming_applications/core/MongoClients';
import {EventStoreTransformer} from '../../../src/streaming_applications/core/streams/EventStoreTransformer';
import {AgencyClientsProjectionTransformer} from '../../../src/streaming_applications/AgencyClientsProjection/transformers/AgencyClientsProjectionTransformer';

describe('EventStorePipeline', function () {
  let logger: LoggerContext;
  let eventStorePipeline: EventStorePipeline;

  beforeEach(function () {
    eventStorePipeline = new EventStorePipeline();
    logger = TestUtilsLogger.getLogger(sinon.spy());
  });

  afterEach(function () {
    sinon.restore();
  });

  describe('getID()', function () {
    it('should return expected pipeline id', function () {
      const id = eventStorePipeline.getID();
      const expectedId = 'agency_client_event_store';

      assert.equal(id, expectedId, 'Expected id not returned');
    });
  });

  describe('getMongoClientConfigKeys()', function () {
    it('should return client expected config keys', function () {
      const keys = eventStorePipeline.getMongoClientConfigKeys();
      const expectedKeys = [AGENCY_CLIENT_MANAGEMENT_DB_KEY];

      assert.deepEqual(keys, expectedKeys, 'Expected keys not returned');
    });
  });

  describe('getType()', function () {
    it('should return expected pipeline type', function () {
      const type = eventStorePipeline.getType();

      assert.deepEqual(type, PIPELINE_TYPES_ENUM.CORE, 'Expected pipeline type not returned');
    });
  });

  describe('watch()', function () {
    const watchStream: any = {
      on: () => this,
      pipe: () => watchStream
    };
    const dbObject: any = {
      collection: () => dbObject,
      watch: () => watchStream
    };
    const writerStream: any = {
      on: () => this
    };
    const tokenManager = stubConstructor(ResumeTokenCollectionManager);

    tokenManager.getResumeTokenWriterStream.returns(writerStream);

    it('test that the pipeline is configured correctly', async function () {
      const pipeSpy = sinon.spy(watchStream, 'pipe');
      const clientManager = stubConstructor(MongoClients);

      clientManager.getClientDatabase.resolves(dbObject);

      await eventStorePipeline.watch(logger, clientManager, tokenManager);

      assert.equal(pipeSpy.callCount, 3, 'Expected 3 components to be attached to watch stream');

      // Assert that each step is attached in the correct sequence with the correct object
      const eventStoreTransformerCallArgs = pipeSpy.getCall(0).args;
      const projectionTransformerCallArgs = pipeSpy.getCall(1).args;
      const tokenWriterStreamCallArgs = pipeSpy.getCall(2).args;

      assert.instanceOf(eventStoreTransformerCallArgs[0], EventStoreTransformer);
      assert.instanceOf(projectionTransformerCallArgs[0], AgencyClientsProjectionTransformer);
      assert.deepEqual(
        tokenWriterStreamCallArgs[0],
        tokenManager.getResumeTokenWriterStream(eventStorePipeline.getID(), STREAM_TYPES_ENUM.WATCH, {
          highWaterMark: 5
        })
      );
    });
  });
});
