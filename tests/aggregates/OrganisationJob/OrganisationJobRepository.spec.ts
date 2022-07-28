import sinon from 'sinon';
import {stubInterface} from 'ts-sinon';
import {AgencyRepository} from '../../../src/aggregates/Agency/AgencyRepository';
import {OrganisationJobRepository} from '../../../src/aggregates/OrganisationJob/OrganisationJobRepository';
import {EventRepository, EventPointInTimeType} from '../../../src/EventRepository';
import {EventStore} from '../../../src/models/EventStore';
import {OrganisationJobWriteProjectionHandler} from '../../../src/aggregates/OrganisationJob/OrganisationJobWriteProjectionHandler';
import {OrganisationJobAggregateIdInterface} from '../../../src/aggregates/OrganisationJob/types';

describe('OrganisationJobRepository class', () => {
  afterEach(() => {
    sinon.restore();
  });
  const organisationId = 'organisation id';
  const agencyId = 'agency id';
  const aggregateId: OrganisationJobAggregateIdInterface = {
    name: 'organisation_job',
    agency_id: agencyId,
    organisation_id: organisationId
  };

  describe('getAggregate()', () => {
    it('Test calling OrganisationJobAggregate', async () => {
      const pointInTime: EventPointInTimeType = {sequence_id: 100};
      const eventRepository = new EventRepository(EventStore, 'some-id');
      const writeProjectionHandler = new OrganisationJobWriteProjectionHandler();
      const organisationRepository = new OrganisationJobRepository(eventRepository, writeProjectionHandler);

      const projection: any = {
        oops: 'ok'
      };

      const leftFoldEvents = sinon.stub(eventRepository, 'leftFoldEvents').resolves(projection);

      const aggregate = await organisationRepository.getAggregate(aggregateId, pointInTime);

      leftFoldEvents.should.have.been.calledWith(
        writeProjectionHandler,
        {
          name: 'organisation_job',
          organisation_id: organisationId,
          agency_id: agencyId
        },
        pointInTime
      );
      aggregate.getId().organisation_id.should.equal(organisationId);
    });
  });
});
