import sinon from 'sinon';
import {AgencyRepository} from '../../src/Agency/AgencyRepository';
import {AgencyWriteProjection} from '../../src/Agency/AgencyWriteProjection';
import {AgencyAggregateRecordInterface, AgencyEventEnum} from '../../src/Agency/types';
import {EventRepository} from '../../src/EventRepository';
import {EventStore} from '../../src/models/EventStore';

describe('AgencyRepository class', () => {
  afterEach(() => {
    sinon.restore();
  });
  const agencyId = 'agency id';

  describe('getAggregate()', () => {
    it('Test calling AgencyAggregate', async () => {
      const eventRepository = new EventRepository(EventStore, 'some-id');
      const agencyRepository = new AgencyRepository(eventRepository);

      const projection: AgencyAggregateRecordInterface = {
        consultant_roles: [],
        last_sequence_id: 10
      };

      const leftFoldEvents = sinon.stub(eventRepository, 'leftFoldEvents').resolves(projection);

      const aggregate = await agencyRepository.getAggregate(agencyId);

      leftFoldEvents.should.have.been.calledWith(AgencyWriteProjection, {agency_id: agencyId}, undefined);
      aggregate.getId().agency_id.should.to.equal(agencyId);
    });
  });

  describe('save()', () => {
    it('Test call eventRepository', async () => {
      const eventRepository = new EventRepository(EventStore, 'some-id');
      const agencyRepository = new AgencyRepository(eventRepository);
      const save = sinon.stub(eventRepository, 'save').resolves([]);
      const events = [
        {
          type: AgencyEventEnum.AGENCY_CONSULTANT_ROLE_ADDED,
          aggregate_id: {agency_id: agencyId},
          data: {},
          sequence_id: 10
        }
      ];

      await agencyRepository.save(events);
      save.should.have.been.calledWith(events);
    });
  });
});
