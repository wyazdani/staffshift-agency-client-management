import sinon from 'sinon';
import {stubInterface} from 'ts-sinon';
import {AgencyRepository} from '../../../src/aggregates/Agency/AgencyRepository';
import {ConsultantJobRepository} from '../../../src/aggregates/ConsultantJob/ConsultantJobRepository';
import {EventRepository} from '../../../src/EventRepository';
import {EventStore} from '../../../src/models/EventStore';
import {AgencyWriteProjectionHandler} from '../../../src/aggregates/Agency/AgencyWriteProjectionHandler';

describe('ConsultantJobRepository class', () => {
  afterEach(() => {
    sinon.restore();
  });
  const agencyId = 'agency id';

  describe('getAggregate()', () => {
    it('Test calling AgencyAggregate', async () => {
      const eventRepository = new EventRepository(EventStore, 'some-id');
      const writeProjectionHandler = new AgencyWriteProjectionHandler();
      const agencyRepository = stubInterface<AgencyRepository>();
      const consultantRepository = new ConsultantJobRepository(eventRepository, writeProjectionHandler, agencyRepository);

      const projection: any = {
        oops: 'ok'
      };

      const leftFoldEvents = sinon.stub(eventRepository, 'leftFoldEvents').resolves(projection);

      const aggregate = await consultantRepository.getAggregate(agencyId);

      leftFoldEvents.should.have.been.calledWith(
        writeProjectionHandler,
        {
          name: 'consultant_job',
          agency_id: agencyId
        },
        undefined
      );
      aggregate.getId().agency_id.should.equal(agencyId);
    });
  });

  describe('save()', () => {
    it('Test call eventRepository', async () => {
      const eventRepository = new EventRepository(EventStore, 'some-id');
      const agencyRepository = stubInterface<AgencyRepository>();
      const consultantRepository = new ConsultantJobRepository(
        eventRepository,
        new AgencyWriteProjectionHandler(),
        agencyRepository
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
