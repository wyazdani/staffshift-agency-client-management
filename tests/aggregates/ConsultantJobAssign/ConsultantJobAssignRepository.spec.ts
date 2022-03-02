import sinon from 'sinon';
import {ConsultantJobAssignRepository} from '../../../src/aggregates/ConsultantJobAssign/ConsultantJobAssignRepository';
import {EventRepository} from '../../../src/EventRepository';
import {EventStore} from '../../../src/models/EventStore';
import {AgencyWriteProjectionHandler} from '../../../src/aggregates/Agency/AgencyWriteProjectionHandler';

describe('ConsultantJobAssignRepository class', () => {
  afterEach(() => {
    sinon.restore();
  });
  const agencyId = 'agency id';
  const jobId = 'job id';

  describe('getAggregate()', () => {
    it('Test calling AgencyAggregate', async () => {
      const eventRepository = new EventRepository(EventStore, 'some-id');
      const writeProjectionHandler = new AgencyWriteProjectionHandler();
      const consultantRepository = new ConsultantJobAssignRepository(eventRepository, writeProjectionHandler);

      const projection: any = {
        oops: 'ok'
      };

      const leftFoldEvents = sinon.stub(eventRepository, 'leftFoldEvents').resolves(projection);

      const aggregate = await consultantRepository.getAggregate(agencyId, jobId);

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
        new AgencyWriteProjectionHandler()
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
