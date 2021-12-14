import sinon from 'sinon';
import {assert} from 'chai';
import {LoggerContext} from 'a24-logzio-winston';
import {EventRepository} from '../../../../src/EventRepository';
import {TestUtilsLogger} from '../../../tools/TestUtilsLogger';
import {stubConstructor} from 'ts-sinon';
import {AgencyClientsProjection} from '../../../../src/models/AgencyClientsProjection';
import {PassThrough} from 'stream';
import {AgencyClientsProjectionTransformer} from '../../../../src/streaming_applications/AgencyClientsProjection/transformers/AgencyClientsProjectionTransformer';
import {EventsEnum} from '../../../../src/Events';

describe('AgencyClientsProjectionTransformer', function () {
  let logger: LoggerContext;
  let eventRepository: EventRepository;
  let opts: any;
  let model: any;
  let agencyClientsProjectionTransformer: any;

  beforeEach(() => {
    logger = TestUtilsLogger.getLogger(sinon.spy());
    eventRepository = stubConstructor(EventRepository);
    model = AgencyClientsProjection;
    opts = {
      eventRepository,
      model,
      pipeline: 'agency_client_event_store',
      logger: logger
    };
    agencyClientsProjectionTransformer = new AgencyClientsProjectionTransformer(opts);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('_transform()', function () {
    const agencyId = '60126eb559f35a4f3c34ff07';
    const clientId = '60126eb559f35a4f3c34ff06';
    const orgId = '61b8991abfb74a7157c6d88f';

    it('test that unsupported event are consumed successfully', (done) => {
      const testData = {
        event: {
          type: 'someRandomEvent'
        }
      };
      const options = {
        objectMode: true,
        highWaterMark: 1,
        version: '3.6.3'
      };
      const inputStream = new PassThrough(options);
      const outputStream = new PassThrough(options);

      inputStream.pipe(agencyClientsProjectionTransformer).pipe(outputStream);
      outputStream.on('data', (data) => {
        assert.deepEqual(data, testData, 'Expected output stream was not returned');
      });
      outputStream.on('end', () => done());
      inputStream.write(testData);
      inputStream.resume();
      inputStream.end();
    });

    it('test that agency client record is updated correctly for AgencyClientLinked event', function (done) {
      const testData = {
        event: {
          type: EventsEnum.AGENCY_CLIENT_LINKED,
          aggregate_id: {
            agency_id: agencyId,
            client_id: clientId
          },
          data: {
            linked: true,
            organisation_id: orgId,
            client_type: 'site'
          }
        }
      };
      const options = {
        objectMode: true,
        highWaterMark: 1,
        version: '3.6.3'
      };
      const inputStream = new PassThrough(options);
      const outputStream = new PassThrough(options);

      const expectedFilter = {
        agency_id: agencyId,
        client_id: clientId,
        organisation_id: orgId
      };
      const expectedUpdate = {
        client_type: 'site',
        linked: true
      };
      const findOneAndUpdateStub = sinon.stub(AgencyClientsProjection, 'findOneAndUpdate');

      findOneAndUpdateStub.callsFake((filter: any, update: any, opts: any, callback: any) => {
        assert.deepEqual(filter, expectedFilter, 'incorrect query filter');
        assert.deepEqual(update, expectedUpdate, 'incorrect update');
        assert.deepEqual(opts, {upsert: true}, 'Incorrect update options');
        return callback();
      });

      inputStream.pipe(agencyClientsProjectionTransformer).pipe(outputStream);
      outputStream.on('data', (data) => {
        assert.deepEqual(data, testData, 'Expected output stream was not returned');
      });

      outputStream.on('end', () => done());
      inputStream.write(testData);
      inputStream.resume();
      inputStream.end();
    });

    it('test that agency client record is updated correctly for AgencyClientUnLinked event', function (done) {
      const testData = {
        event: {
          type: EventsEnum.AGENCY_CLIENT_UNLINKED,
          aggregate_id: {
            agency_id: agencyId,
            client_id: clientId
          },
          data: {
            linked: false,
            organisation_id: orgId,
            client_type: 'site'
          }
        }
      };
      const options = {
        objectMode: true,
        highWaterMark: 1,
        version: '3.6.3'
      };
      const inputStream = new PassThrough(options);
      const outputStream = new PassThrough(options);

      const expectedFilter = {
        agency_id: agencyId,
        client_id: clientId,
        organisation_id: orgId
      };
      const expectedUpdate = {
        client_type: 'site',
        linked: false
      };
      const findOneAndUpdateStub = sinon.stub(AgencyClientsProjection, 'findOneAndUpdate');

      findOneAndUpdateStub.callsFake((filter: any, update: any, opts: any, callback: any) => {
        assert.deepEqual(filter, expectedFilter, 'incorrect query filter');
        assert.deepEqual(update, expectedUpdate, 'incorrect update');
        assert.deepEqual(opts, {upsert: true}, 'Incorrect update options');
        return callback();
      });

      inputStream.pipe(agencyClientsProjectionTransformer).pipe(outputStream);
      outputStream.on('data', (data) => {
        assert.deepEqual(data, testData, 'Expected output stream was not returned');
      });

      outputStream.on('end', () => done());
      inputStream.write(testData);
      inputStream.resume();
      inputStream.end();
    });

    it('test that agency client record is updated correctly for AgencyClientSynced event', function (done) {
      const testData = {
        event: {
          type: EventsEnum.AGENCY_CLIENT_SYNCED,
          aggregate_id: {
            agency_id: agencyId,
            client_id: clientId
          },
          data: {
            linked: false,
            organisation_id: orgId,
            client_type: 'site'
          }
        }
      };
      const options = {
        objectMode: true,
        highWaterMark: 1,
        version: '3.6.3'
      };
      const inputStream = new PassThrough(options);
      const outputStream = new PassThrough(options);

      const expectedFilter = {
        agency_id: agencyId,
        client_id: clientId,
        organisation_id: orgId
      };
      const expectedUpdate = {
        client_type: 'site',
        linked: false
      };
      const findOneAndUpdateStub = sinon.stub(AgencyClientsProjection, 'findOneAndUpdate');

      findOneAndUpdateStub.callsFake((filter: any, update: any, opts: any, callback: any) => {
        assert.deepEqual(filter, expectedFilter, 'incorrect query filter');
        assert.deepEqual(update, expectedUpdate, 'incorrect update');
        assert.deepEqual(opts, {upsert: true}, 'Incorrect update options');
        return callback();
      });

      inputStream.pipe(agencyClientsProjectionTransformer).pipe(outputStream);
      outputStream.on('data', (data) => {
        assert.deepEqual(data, testData, 'Expected output stream was not returned');
      });

      outputStream.on('end', () => done());
      inputStream.write(testData);
      inputStream.resume();
      inputStream.end();
    });
  });
});
