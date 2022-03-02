import sinon from 'sinon';
import {AgencyRepository} from '../../../src/aggregates/Agency/AgencyRepository';
import {AgencyAggregateRecordInterface} from '../../../src/aggregates/Agency/types';
import {EventRepository} from '../../../src/EventRepository';
import {EventStore} from '../../../src/models/EventStore';
import {EventsEnum} from '../../../src/Events';
import {AgencyWriteProjectionHandler} from '../../../src/aggregates/Agency/AgencyWriteProjectionHandler';

describe('AgencyRepository class', () => {
  afterEach(() => {
    sinon.restore();
  });
  const agencyId = 'agency id';

  describe('getAggregate()', () => {
    it('Test calling AgencyAggregate', async () => {
      const eventRepository = new EventRepository(EventStore, 'some-id');
      const writeProjectionHandler = new AgencyWriteProjectionHandler();
      const agencyRepository = new AgencyRepository(eventRepository, writeProjectionHandler);

      const projection: AgencyAggregateRecordInterface = {
        consultant_roles: [],
        last_sequence_id: 10
      };

      const leftFoldEvents = sinon.stub(eventRepository, 'leftFoldEvents').resolves(projection);

      const aggregate = await agencyRepository.getAggregate(agencyId);

      leftFoldEvents.should.have.been.calledWith(writeProjectionHandler, {agency_id: agencyId}, undefined);
      aggregate.getId().agency_id.should.equal(agencyId);
    });
  });

  describe('save()', () => {
    it('Test call eventRepository', async () => {
      const eventRepository = new EventRepository(EventStore, 'some-id');
      const agencyRepository = new AgencyRepository(eventRepository, new AgencyWriteProjectionHandler());
      const save = sinon.stub(eventRepository, 'save').resolves([]);
      const events = [
        {
          type: EventsEnum.AGENCY_CONSULTANT_ROLE_ADDED,
          aggregate_id: {agency_id: agencyId},
          data: {
            _id: 'some id'
          },
          sequence_id: 10
        }
      ];

      await agencyRepository.save(events);
      save.should.have.been.calledWith(events);
    });
  });
});