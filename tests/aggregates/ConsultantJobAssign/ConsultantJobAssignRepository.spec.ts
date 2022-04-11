import sinon from 'sinon';
import {ConsultantJobAssignRepository} from '../../../src/aggregates/ConsultantJobAssign/ConsultantJobAssignRepository';
import {EventRepository} from '../../../src/EventRepository';
import {EventStore} from '../../../src/models/EventStore';
import {ConsultantJobAssignWriteProjectionHandler} from '../../../src/aggregates/ConsultantJobAssign/ConsultantJobAssignWriteProjectionHandler';
import {ConsultantJobAssignAggregateIdInterface} from '../../../src/aggregates/ConsultantJobAssign/types';

describe('ConsultantJobAssignRepository class', () => {
  afterEach(() => {
    sinon.restore();
  });
  const agencyId = 'agency id';
  const jobId = 'job id';
  const aggregateId: ConsultantJobAssignAggregateIdInterface = {
    name: 'consultant_job_assign',
    agency_id: agencyId,
    job_id: jobId
  };

  describe('getAggregate()', () => {
    it('Test calling AgencyAggregate', async () => {
      const eventRepository = new EventRepository(EventStore, 'some-id');
      const writeProjectionHandler = new ConsultantJobAssignWriteProjectionHandler();
      const consultantRepository = new ConsultantJobAssignRepository(eventRepository, writeProjectionHandler);
      const projection: any = {oops: 'ok'};
      const leftFoldEvents = sinon.stub(eventRepository, 'leftFoldEvents').resolves(projection);
      const aggregate = await consultantRepository.getAggregate(aggregateId);

      leftFoldEvents.should.have.been.calledWith(
        writeProjectionHandler,
        {
          name: 'consultant_job_assign',
          agency_id: agencyId,
          job_id: jobId
        },
        undefined
      );
      aggregate.getId().agency_id.should.equal(agencyId);
    });
  });

  describe('save()', () => {
    it('Test call eventRepository', async () => {
      const eventRepository = new EventRepository(EventStore, 'some-id');
      const consultantRepository = new ConsultantJobAssignRepository(
        eventRepository,
        new ConsultantJobAssignWriteProjectionHandler()
      );
      const save = sinon.stub(eventRepository, 'save').resolves([]);
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
