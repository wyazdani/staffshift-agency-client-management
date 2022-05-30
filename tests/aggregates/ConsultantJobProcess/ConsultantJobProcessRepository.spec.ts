import sinon from 'sinon';
import {ConsultantJobProcessRepository} from '../../../src/aggregates/ConsultantJobProcess/ConsultantJobProcessRepository';
import {EventRepository, EventPointInTimeType} from '../../../src/EventRepository';
import {EventStore} from '../../../src/models/EventStore';
import {ConsultantJobProcessWriteProjectionHandler} from '../../../src/aggregates/ConsultantJobProcess/ConsultantJobProcessWriteProjectionHandler';
import {ConsultantJobProcessAggregateIdInterface} from '../../../src/aggregates/ConsultantJobProcess/types';

describe('ConsultantJobProcessRepository class', () => {
  afterEach(() => {
    sinon.restore();
  });
  const agencyId = 'agency id';
  const jobId = 'job id';
  const aggregateId: ConsultantJobProcessAggregateIdInterface = {
    name: 'consultant_job_process',
    agency_id: agencyId,
    job_id: jobId
  };

  describe('getAggregate()', () => {
    it('Test calling AgencyAggregate', async () => {
      const pointInTime: EventPointInTimeType = {sequence_id: 100};
      const eventRepository = new EventRepository(EventStore, 'some-id');
      const writeProjectionHandler = new ConsultantJobProcessWriteProjectionHandler();
      const consultantRepository = new ConsultantJobProcessRepository(eventRepository, writeProjectionHandler);
      const projection: any = {oops: 'ok'};
      const leftFoldEvents = sinon.stub(eventRepository, 'leftFoldEvents').resolves(projection);
      const aggregate = await consultantRepository.getAggregate(aggregateId, pointInTime);

      leftFoldEvents.should.have.been.calledWith(
        writeProjectionHandler,
        {
          name: 'consultant_job_process',
          agency_id: agencyId,
          job_id: jobId
        },
        pointInTime
      );
      aggregate.getId().agency_id.should.equal(agencyId);
    });
  });

  describe('save()', () => {
    it('Test call eventRepository', async () => {
      const eventRepository = new EventRepository(EventStore, 'some-id');
      const consultantRepository = new ConsultantJobProcessRepository(
        eventRepository,
        new ConsultantJobProcessWriteProjectionHandler()
      );
      const save = sinon.stub(eventRepository, 'save').resolves();
      const events: any = [
        {
          type: 'sample'
        }
      ];

      await consultantRepository.save(events);
      save.should.have.been.calledWith(events);
    });
  });
});
