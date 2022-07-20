import sinon from 'sinon';
import {ClientInheritanceProcessRepository} from '../../../src/aggregates/ClientInheritanceProcess/ClientInheritanceProcessRepository';
import {EventRepository, EventPointInTimeType} from '../../../src/EventRepository';
import {EventStore} from '../../../src/models/EventStore';
import {ClientInheritanceProcessWriteProjectionHandler} from '../../../src/aggregates/ClientInheritanceProcess/ClientInheritanceProcessWriteProjectionHandler';
import {ClientInheritanceProcessAggregateIdInterface} from '../../../src/aggregates/ClientInheritanceProcess/types';

describe('ClientInheritanceProcessRepository class', () => {
  afterEach(() => {
    sinon.restore();
  });
  const agencyId = 'agency id';
  const jobId = 'job id';
  const aggregateId: ClientInheritanceProcessAggregateIdInterface = {
    name: 'client_inheritance_process',
    agency_id: agencyId,
    job_id: jobId
  };

  describe('getAggregate()', () => {
    it('Test calling AgencyAggregate', async () => {
      const pointInTime: EventPointInTimeType = {sequence_id: 100};
      const eventRepository = new EventRepository(EventStore, 'some-id');
      const writeProjectionHandler = new ClientInheritanceProcessWriteProjectionHandler();
      const processRepository = new ClientInheritanceProcessRepository(eventRepository, writeProjectionHandler);
      const projection: any = {oops: 'ok'};
      const leftFoldEvents = sinon.stub(eventRepository, 'leftFoldEvents').resolves(projection);
      const aggregate = await processRepository.getAggregate(aggregateId, pointInTime);

      leftFoldEvents.should.have.been.calledWith(
        writeProjectionHandler,
        {
          name: 'client_inheritance_process',
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
      const processRepository = new ClientInheritanceProcessRepository(
        eventRepository,
        new ClientInheritanceProcessWriteProjectionHandler()
      );
      const save = sinon.stub(eventRepository, 'save').resolves();
      const events: any = [
        {
          type: 'sample'
        }
      ];

      await processRepository.save(events);
      save.should.have.been.calledWith(events);
    });
  });
});
