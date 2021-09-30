import sinon from 'sinon';
import {assert} from 'chai';
import {AgencyConsultantRolesProjection} from '../../../../src/models/AgencyConsultantRolesProjection';
import {LoggerContext} from 'a24-logzio-winston';
import {TestUtilsLogger} from '../../../tools/TestUtilsLogger';
import {stubConstructor} from 'ts-sinon';
import {EventRepository} from '../../../../src/EventRepository';
import {PassThrough, TransformOptions} from 'stream';
import {AgencyConsultantProjectionTransformer} from '../../../../src/streaming_applications/AgencyConsultantRolesProjection/transformers/AgencyConsultantProjectionTransformer';
import {Model} from 'mongoose';
import {EventsEnum} from '../../../../src/Events';

interface ProjectionTransformerOptionsInterface extends TransformOptions {
  eventRepository: EventRepository;
  model: Model<any>;
  pipeline: string;
  logger: typeof LoggerContext;
}

describe('AgencyConsultantProjectionTransformer', () => {
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
        assert.deepEqual(data, testData, 'Expected output stream was not returned');
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

      const saveStub = sinon.stub(AgencyConsultantRolesProjection.prototype, 'save');

      saveStub.callsFake((callback) => {
        callback();
      });

      inputStream.pipe(agencyConsultantProjectionTransformer).pipe(outputStream);
      outputStream.on('data', (data) => {
        assert.deepEqual(data, testData, 'Expected output stream was not returned');
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
      const saveStub = sinon.stub(AgencyConsultantRolesProjection.prototype, 'save');

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

      const findOneAndUpdateStub = sinon.stub(AgencyConsultantRolesProjection, 'findOneAndUpdate');

      findOneAndUpdateStub.callsFake((filter: any, update: any, options: any, callback: any): any => {
        assert.deepEqual(filter, {_id: consultantRoleId, agency_id: agencyId}, 'Expected query does not matched');
        assert.deepEqual(update, {status: 'enabled'}, 'Expected record does not matched');
        assert.deepEqual(options, {upsert: true}, 'Expected record does not matched');
        callback(null, record, testData);
        return null;
      });

      inputStream.pipe(agencyConsultantProjectionTransformer).pipe(outputStream);
      outputStream.on('data', (data) => {
        assert.deepEqual(data, testData, 'Expected output stream was not returned');
      });

      outputStream.on('end', () => {
        done();
      });

      inputStream.write(testData);
      inputStream.resume();

      inputStream.end();
    });

    it('test AgencyConsultantRoleEnabled event failure', (done) => {
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
      const options = {
        objectMode: true,
        highWaterMark: 1,
        version: '3.6.3'
      };
      const inputStream = new PassThrough(options);
      const outputStream = new PassThrough(options);

      const error = new Error('my error');
      const findOneAndUpdateStub = sinon.stub(AgencyConsultantRolesProjection, 'findOneAndUpdate');

      findOneAndUpdateStub.callsFake((filter: any, update: any, options: any, callback: any): any => {
        assert.deepEqual(filter, {_id: consultantRoleId, agency_id: agencyId}, 'Expected query does not matched');
        assert.deepEqual(update, {status: 'enabled'}, 'Expected record does not matched');
        assert.deepEqual(options, {upsert: true}, 'Expected record does not matched');
        callback(error);
        return null;
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

    it('test AgencyConsultantRoleDisabled event success', (done) => {
      const testData = {
        event: {
          type: EventsEnum.AGENCY_CONSULTANT_ROLE_DISABLED,
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

      const findOneAndUpdateStub = sinon.stub(AgencyConsultantRolesProjection, 'findOneAndUpdate');

      findOneAndUpdateStub.callsFake((filter: any, update: any, options: any, callback: any): any => {
        assert.deepEqual(filter, {_id: consultantRoleId, agency_id: agencyId}, 'Expected query does not matched');
        assert.deepEqual(update, {status: 'disabled'}, 'Expected record does not matched');
        assert.deepEqual(options, {upsert: true}, 'Expected record does not matched');
        callback(null, record, testData);
        return null;
      });

      inputStream.pipe(agencyConsultantProjectionTransformer).pipe(outputStream);
      outputStream.on('data', (data) => {
        assert.deepEqual(data, testData, 'Expected output stream was not returned');
      });

      outputStream.on('end', () => {
        done();
      });

      inputStream.write(testData);
      inputStream.resume();

      inputStream.end();
    });

    it('test AgencyConsultantRoleDisabled event failure', (done) => {
      const testData = {
        event: {
          type: EventsEnum.AGENCY_CONSULTANT_ROLE_DISABLED,
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
      const findOneAndUpdateStub = sinon.stub(AgencyConsultantRolesProjection, 'findOneAndUpdate');

      findOneAndUpdateStub.callsFake((filter: any, update: any, options: any, callback: any): any => {
        assert.deepEqual(filter, {_id: consultantRoleId, agency_id: agencyId}, 'Expected query does not matched');
        assert.deepEqual(update, {status: 'disabled'}, 'Expected record does not matched');
        assert.deepEqual(options, {upsert: true}, 'Expected record does not matched');
        callback(error);
        return null;
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

    it('test AgencyConsultantRoleDetailsUpdated event success', (done) => {
      const testData = {
        event: {
          type: EventsEnum.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED,
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
      const updateObject = {
        agency_id: testData.event.aggregate_id.agency_id,
        name: testData.event.data.name,
        description: testData.event.data.description,
        max_consultants: testData.event.data.max_consultants
      };
      const options = {
        objectMode: true,
        highWaterMark: 1,
        version: '3.6.3'
      };
      const inputStream = new PassThrough(options);
      const outputStream = new PassThrough(options);

      const findOneAndUpdateStub = sinon.stub(AgencyConsultantRolesProjection, 'findOneAndUpdate');

      findOneAndUpdateStub.callsFake((filter: any, update: any, options: any, callback: any): any => {
        assert.deepEqual(filter, {_id: consultantRoleId, agency_id: agencyId}, 'Expected query does not matched');
        assert.deepEqual(update, updateObject, 'Expected record does not matched');
        assert.deepEqual(options, {upsert: true}, 'Expected record does not matched');
        callback(null, record, testData);
        return null;
      });

      inputStream.pipe(agencyConsultantProjectionTransformer).pipe(outputStream);
      outputStream.on('data', (data) => {
        assert.deepEqual(data, testData, 'Expected output stream was not returned');
      });

      outputStream.on('end', () => {
        done();
      });

      inputStream.write(testData);
      inputStream.resume();

      inputStream.end();
    });

    it('test AgencyConsultantRoleDetailsUpdated event failure', (done) => {
      const testData = {
        event: {
          type: EventsEnum.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED,
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
      const updateObject = {
        agency_id: testData.event.aggregate_id.agency_id,
        name: testData.event.data.name,
        description: testData.event.data.description,
        max_consultants: testData.event.data.max_consultants
      };
      const inputStream = new PassThrough(options);
      const outputStream = new PassThrough(options);

      const error = new Error('my error');
      const findOneAndUpdateStub = sinon.stub(AgencyConsultantRolesProjection, 'findOneAndUpdate');

      findOneAndUpdateStub.callsFake((filter: any, update: any, options: any, callback: any): any => {
        assert.deepEqual(filter, {_id: consultantRoleId, agency_id: agencyId}, 'Expected query does not matched');
        assert.deepEqual(update, updateObject, 'Expected record does not matched');
        assert.deepEqual(options, {upsert: true}, 'Expected record does not matched');
        callback(error);
        return null;
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
  });
});
