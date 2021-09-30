import sinon from 'sinon';
import {assert} from 'chai';
import {AgencyConsultantRolesProjection, AgencyConsultantRolesProjectionDocumentType} from '../../../../src/models/AgencyConsultantRolesProjection';
import {LoggerContext} from 'a24-logzio-winston';
import {TestUtilsLogger} from '../../../tools/TestUtilsLogger';
import {stubConstructor} from 'ts-sinon';
import {EventRepository} from '../../../../src/EventRepository';
import {PassThrough, TransformOptions} from 'stream';
import {AgencyConsultantProjectionTransformer} from '../../../../src/streaming_applications/AgencyConsultantRolesProjection/transformers/AgencyConsultantProjectionTransformer';
import {Model, FilterQuery, UpdateQuery, QueryOptions, NativeError, UpdateWithAggregationPipeline, Query} from 'mongoose';
import {EventsEnum} from '../../../../src/Events';

interface ProjectionTransformerOptionsInterface extends TransformOptions {
  eventRepository: EventRepository;
  model: Model<any>;
  pipeline: string;
  logger: typeof LoggerContext;
}

describe.only('AgencyConsultantProjectionTransformer', () => {
  let logger: typeof LoggerContext;
  let opts: ProjectionTransformerOptionsInterface;
  let eventRepository: EventRepository;
  let model: any;
  let agencyConsultantProjectionTransformer: any;
  const agencyId = '60126eb559f35a4f3c34ff07';
  const consultantRoleId = '60126eb559f35a4f3c34ff06';

  beforeEach(() => {
    logger = TestUtilsLogger.getLogger(sinon.spy());
    eventRepository = stubConstructor(EventRepository);
    model = AgencyConsultantRolesProjection;
    opts = {
      eventRepository,
      model,
      pipeline: 'agency_consultant_roles_event_store',
      logger: logger
    };
    agencyConsultantProjectionTransformer = new AgencyConsultantProjectionTransformer(opts);
  });

  afterEach(() => {
    sinon.restore();
  });

  /*eslint-disable*/
  describe('_transform()', () => {
    it('test unsupported event', (done) => {
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

      inputStream.pipe(agencyConsultantProjectionTransformer).pipe(outputStream);
      outputStream.on('data', (data) => {
        assert.deepEqual(
          data,
          testData,
          'Expected output stream was not returned'
        );
      });

      outputStream.on('end', () => {
        done();
      });

      inputStream.write(testData);
      inputStream.resume();

      inputStream.end();
    });

    it('test AgencyConsultantRoleAdded event success', (done) => {
      const testData = {
        event: {
          type: EventsEnum.AGENCY_CONSULTANT_ROLE_ADDED,
          aggregate_id: {
            agency_id: agencyId
          },
          data: {
            name: 'some name',
            description: 'describe me',
            max_consultants: 1,
            _id: consultantRoleId
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

      let saveStub = sinon.stub(AgencyConsultantRolesProjection.prototype, 'save');
      saveStub.callsFake((callback) => {
        callback();
      });

      inputStream.pipe(agencyConsultantProjectionTransformer).pipe(outputStream);
      outputStream.on('data', (data) => {
        assert.deepEqual(
          data,
          testData,
          'Expected output stream was not returned'
        );
      });

      outputStream.on('end', () => {
        done();
      });

      inputStream.write(testData);
      inputStream.resume();

      inputStream.end();
    });

    it('test AgencyConsultantRoleAdded event failure', (done) => {
      const testData = {
        event: {
          type: EventsEnum.AGENCY_CONSULTANT_ROLE_ADDED,
          aggregate_id: {
            agency_id: agencyId
          },
          data: {
            name: 'some name',
            description: 'describe me',
            max_consultants: 1,
            _id: consultantRoleId
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

      const error = new Error('my error');
      let saveStub = sinon.stub(AgencyConsultantRolesProjection.prototype, 'save');
      saveStub.callsFake((callback) => {
        callback(error);
      });

      inputStream.pipe(agencyConsultantProjectionTransformer).pipe(outputStream);
      agencyConsultantProjectionTransformer.on('error', (err: Error) => {
        assert.deepEqual(err, error, 'Expected error was not returned');
        done();
      });

      inputStream.write(testData);
      inputStream.resume();

      inputStream.end();
    });

    it('test AgencyConsultantRoleEnabled event success', (done) => {
      const testData = {
        event: {
          type: EventsEnum.AGENCY_CONSULTANT_ROLE_ENABLED,
          aggregate_id: {
            agency_id: agencyId
          },
          data: {
            name: 'some name',
            description: 'describe me',
            max_consultants: 1,
            _id: consultantRoleId
          }
        }
      };
      const record = new AgencyConsultantRolesProjection({
        agency_id: testData.event.aggregate_id.agency_id,
        name: testData.event.data.name,
        description: testData.event.data.description,
        max_consultants: testData.event.data.max_consultants,
        _id: testData.event.data._id
      });
      const options = {
        objectMode: true,
        highWaterMark: 1,
        version: '3.6.3'
      };
      const inputStream = new PassThrough(options);
      const outputStream = new PassThrough(options);

      let findOneAndUpdateStub = sinon.stub(AgencyConsultantRolesProjection, 'findOneAndUpdate');
      findOneAndUpdateStub.callsFake((
        filter: any, update: any, options: any, callback: any
        // filter?: FilterQuery<AgencyConsultantRolesProjectionDocumentType>, update?: UpdateWithAggregationPipeline | UpdateQuery<any>, options?: QueryOptions, callback?: (err: NativeError, doc: AgencyConsultantRolesProjectionDocumentType, res: any) => void
      ) => {
        assert.deepEqual(filter, {_id: consultantRoleId, agency_id: agencyId}, 'Expected query does not matched');
        assert.deepEqual(update, {status: 'enabled'}, 'Expected record does not matched');
        assert.deepEqual(options, {upsert: true}, 'Expected record does not matched');
        callback(null, record, testData);
        return null;
      });

      inputStream.pipe(agencyConsultantProjectionTransformer).pipe(outputStream);
      outputStream.on('data', (data) => {
        assert.deepEqual(
          data,
          testData,
          'Expected output stream was not returned'
        );
      });

      outputStream.on('end', () => {
        done();
      });

      inputStream.write(testData);
      inputStream.resume();

      inputStream.end();
    });
  });
});
