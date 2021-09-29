import sinon from 'sinon';
import {assert} from 'chai';
import {EventStorePipeline} from '../../../src/streaming_applications/AgencyConsultantRolesProjection/EventStorePipeline';
import {AGENCY_CLIENT_MANAGEMENT_DB_KEY} from '../../../src/streaming_applications/DatabaseConfigKeys';
import {MongoClients} from '../../../src/streaming_applications/core/MongoClients';
import {Db} from 'mongodb';
import {LoggerContext} from 'a24-logzio-winston';
import {TestUtilsLogger} from '../../tools/TestUtilsLogger';
import {stubConstructor} from 'ts-sinon';
import {ResumeTokenCollectionManager} from '../../../src/streaming_applications/core/ResumeTokenCollectionManager';
import {EventStoreTransformer} from '../../../src/streaming_applications/core/streams/EventStoreTransformer';
import {AgencyConsultantProjectionTransformer} from '../../../src/streaming_applications/AgencyConsultantRolesProjection/transformers/AgencyConsultantProjectionTransformer';
import {STREAM_TYPES_ENUM} from '../../../src/streaming_applications/core/ChangeStreamEnums';

describe('EventStorePipeline', () => {
  let logger: typeof LoggerContext;
  let eventStorePipeline: EventStorePipeline;

  beforeEach(() => {
    eventStorePipeline = new EventStorePipeline();
    logger = TestUtilsLogger.getLogger(sinon.spy());
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('getID()', () => {
    it('should return id', () => {
      const id = eventStorePipeline.getID();
      const expectedId = 'agency_consultant_roles_event_store';

      assert.deepEqual(id, expectedId, 'Expected id not returned');
    });
  });

  describe('getMongoClientConfigKeys()', () => {
    it('should return client config keys', () => {
      const keys = eventStorePipeline.getMongoClientConfigKeys();
      const expectedKeys = [AGENCY_CLIENT_MANAGEMENT_DB_KEY];

      assert.deepEqual(keys, expectedKeys, 'Expected keys not returned');
    });
  });

  describe('watch() test scenarios', () => {
    const watchStream: any = {
      pipe: (component: any) => this
    };
    const dbObject = stubConstructor(Db);

    dbObject.watch.returns(watchStream);
    const tokenManager = stubConstructor(ResumeTokenCollectionManager);

    afterEach(() => {
      sinon.restore();
    });

    it('Assert the pipeline is configured as expected', async () => {
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
      assert.instanceOf(projectionTransformerCallArgs[0], AgencyConsultantProjectionTransformer);
      assert.deepEqual(
        tokenWriterStreamCallArgs[0],
        tokenManager.getResumeTokenWriterStream(eventStorePipeline.getID(), STREAM_TYPES_ENUM.WATCH, {highWaterMark: 5})
      );
    });
  });
});
