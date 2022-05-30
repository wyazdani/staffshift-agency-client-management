import sinon from 'sinon';
import {stubInterface} from 'ts-sinon';
import {AgencyRepository} from '../../../src/aggregates/Agency/AgencyRepository';
import {AgencyClientRepository} from '../../../src/aggregates/AgencyClient/AgencyClientRepository';
import {EventRepository, EventPointInTimeType} from '../../../src/EventRepository';
import {EventStore} from '../../../src/models/EventStore';
import {AgencyClientWriteProjectionHandler} from '../../../src/aggregates/AgencyClient/AgencyClientWriteProjectionHandler';
import {AgencyClientAggregateIdInterface} from '../../../src/aggregates/AgencyClient/types';

describe('AgencyClientRepository class', () => {
  afterEach(() => {
    sinon.restore();
  });
  const agencyId = 'agency id';
  const clientId = 'client id';
  const aggregateId: AgencyClientAggregateIdInterface = {
    agency_id: agencyId,
    client_id: clientId
  };

  describe('getAggregate()', () => {
    it('Test calling AgencyAggregate', async () => {
      const pointInTime: EventPointInTimeType = {sequence_id: 100};
      const eventRepository = new EventRepository(EventStore, 'some-id');
      const writeProjectionHandler = new AgencyClientWriteProjectionHandler();
      const agencyRepository = stubInterface<AgencyRepository>();
      const agencyClientRepository = new AgencyClientRepository(
        eventRepository,
        writeProjectionHandler,
        agencyRepository
      );

      const projection: any = {
        oops: 'ok'
      };

      const leftFoldEvents = sinon.stub(eventRepository, 'leftFoldEvents').resolves(projection);

      const aggregate = await agencyClientRepository.getAggregate(aggregateId, pointInTime);

      leftFoldEvents.should.have.been.calledWith(
        writeProjectionHandler,
        {
          agency_id: agencyId,
          client_id: clientId
        },
        pointInTime
      );
      aggregate.getId().agency_id.should.equal(agencyId);
    });
  });

  describe('save()', () => {
    it('Test call eventRepository', async () => {
      const eventRepository = new EventRepository(EventStore, 'some-id');
      const agencyRepository = stubInterface<AgencyRepository>();
      const agencyClientRepository = new AgencyClientRepository(
        eventRepository,
        new AgencyClientWriteProjectionHandler(),
        agencyRepository
      );
      const save = sinon.stub(eventRepository, 'save').resolves();
      const events: any = [
        {
          type: 'sample'
        }
      ];

      await agencyClientRepository.save(events);
      save.should.have.been.calledWith(events);
    });
  });
});
