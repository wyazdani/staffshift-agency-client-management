import sinon from 'sinon';
import {stubInterface} from 'ts-sinon';
import {AgencyRepository} from '../../../src/aggregates/Agency/AgencyRepository';
import {ConsultantJobRepository} from '../../../src/aggregates/ConsultantJob/ConsultantJobRepository';
import {EventRepository} from '../../../src/EventRepository';
import {EventStore} from '../../../src/models/EventStore';
import {ConsultantJobWriteProjectionHandler} from '../../../src/aggregates/ConsultantJob/ConsultantJobWriteProjectionHandler';
import {ConsultantJobAggregateIdInterface} from '../../../src/aggregates/ConsultantJob/types';

describe('ConsultantJobRepository class', () => {
  afterEach(() => {
    sinon.restore();
  });
  const agencyId = 'agency id';
  const aggregateId: ConsultantJobAggregateIdInterface = {
    name: 'consultant_job',
    agency_id: agencyId
  };

  describe('getAggregate()', () => {
    it('Test calling AgencyAggregate', async () => {
      const eventRepository = new EventRepository(EventStore, 'some-id');
      const writeProjectionHandler = new ConsultantJobWriteProjectionHandler();
      const agencyRepository = stubInterface<AgencyRepository>();
      const consultantRepository = new ConsultantJobRepository(
        eventRepository,
        writeProjectionHandler,
        agencyRepository
      );

      const projection: any = {
        oops: 'ok'
      };

      const leftFoldEvents = sinon.stub(eventRepository, 'leftFoldEvents').resolves(projection);

      const aggregate = await consultantRepository.getAggregate(aggregateId);

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
        new ConsultantJobWriteProjectionHandler(),
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
