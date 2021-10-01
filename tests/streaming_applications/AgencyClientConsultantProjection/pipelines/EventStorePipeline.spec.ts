import sinon, {stubConstructor} from 'ts-sinon';
import {assert} from 'chai';
import {TestUtilsLogger} from '../../../tools/TestUtilsLogger';
import {LoggerContext} from 'a24-logzio-winston';
import {EventStorePipeline} from '../../../../src/streaming_applications/AgencyClientConsultantProjection/pipelines/EventStorePipeline';
import {PIPELINE_TYPES_ENUM, STREAM_TYPES_ENUM} from '../../../../src/streaming_applications/core/ChangeStreamEnums';
import {AGENCY_CLIENT_MANAGEMENT_DB_KEY} from '../../../../src/streaming_applications/DatabaseConfigKeys';
import {Readable, Writable} from 'stream';
import {ResumeTokenCollectionManager} from '../../../../src/streaming_applications/core/ResumeTokenCollectionManager';
import {MongoClients} from '../../../../src/streaming_applications/core/MongoClients';
import {EventStoreTransformer} from '../../../../src/streaming_applications/core/streams/EventStoreTransformer';
import {AgencyClientConsultantProjection} from '../../../../src/streaming_applications/AgencyClientConsultantProjection/transformers/AgencyClientConsultantProjection';

describe('EventStorePipeline', () => {
  let testLogger: LoggerContext;

  let resumeTokenManager: any;
  let writableStream: any;
  let readableStream: any;

  beforeEach(() => {
    testLogger = TestUtilsLogger.getLogger(sinon.spy());
    writableStream = stubConstructor(Writable);
    readableStream = stubConstructor(Readable);
    resumeTokenManager = stubConstructor(ResumeTokenCollectionManager);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('getID()', () => {
    it('Test that expected pipeline id is returned', () => {
      const eventStorePipeline = new EventStorePipeline();
      const pipelineId = eventStorePipeline.getID();

      assert.equal(pipelineId, 'agency_client_consultant_event_store', 'Expected pipeline id was not returned');
    });
  });

  describe('getType()', () => {
    it('Test that expected pipeline type is returned', () => {
      const eventStorePipeline = new EventStorePipeline();
      const pipelineType = eventStorePipeline.getType();

      assert.equal(pipelineType, PIPELINE_TYPES_ENUM.CORE, 'Expected pipeline type was not returned');
    });
  });

  describe('getMongoClientConfigKeys()', () => {
    it('Test that expected pipeline mongo client config keys are returned', () => {
      const eventStorePipeline = new EventStorePipeline();
      const pipelineConfigKeys = eventStorePipeline.getMongoClientConfigKeys();

      assert.deepEqual(pipelineConfigKeys, [AGENCY_CLIENT_MANAGEMENT_DB_KEY], 'Expected config keys were not returned');
    });
  });

  describe('watch()', () => {
    it('test that the pipeline is configured correctly', async () => {
      const dbObject: any = {
        collection: () => dbObject,
        watch: () => readableStream
      };
      const clientManager = stubConstructor(MongoClients);

      readableStream.on.returns();
      readableStream.pipe.returns(readableStream);
      writableStream.on.returns();
      resumeTokenManager.setResumeAfterWatchOptions.resolves({});
      resumeTokenManager.getResumeTokenWriterStream.returns(writableStream);
      clientManager.getClientDatabase.resolves(dbObject);

      const pipeline = new EventStorePipeline();

      await pipeline.watch(testLogger, clientManager, resumeTokenManager);

      assert.equal(readableStream.pipe.callCount, 3, 'Expected 3 components to be attached to watch stream');

      // Assert that each step is attached in the correct sequence with the correct object
      assert.instanceOf(readableStream.pipe.getCall(0).args[0], EventStoreTransformer);
      assert.instanceOf(readableStream.pipe.getCall(1).args[0], AgencyClientConsultantProjection);
      assert.deepEqual(
        readableStream.pipe.getCall(2).args[0],
        resumeTokenManager.getResumeTokenWriterStream(pipeline.getID(), STREAM_TYPES_ENUM.WATCH, {highWaterMark: 5})
      );
    });
  });
});
