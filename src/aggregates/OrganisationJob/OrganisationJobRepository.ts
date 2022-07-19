import {AgencyRepository} from '../Agency/AgencyRepository';
import {EventRepository, EventPointInTimeType} from '../../EventRepository';
import {OrganisationJobAggregateIdInterface, OrganisationJobAggregateRecordInterface} from './types';
import {AbstractRepository} from '../AbstractRepository';
import {OrganisationJobWriteProjectionHandler} from './OrganisationJobWriteProjectionHandler';
import {OrganisationJobAggregate} from './OrganisationJobAggregate';

/**
 * Class responsible for interacting with aggregate data source
 */
export class OrganisationJobRepository extends AbstractRepository {
  constructor(
    protected eventRepository: EventRepository,
    private projectionHandler: OrganisationJobWriteProjectionHandler
  ) {
    super(eventRepository);
  }

  async getAggregate(
    aggregateId: OrganisationJobAggregateIdInterface,
    pointInTime?: EventPointInTimeType
  ): Promise<OrganisationJobAggregate> {
    const projection: OrganisationJobAggregateRecordInterface = await this.eventRepository.leftFoldEvents(
      this.projectionHandler,
      {name: aggregateId.name, agency_id: aggregateId.agency_id, organisation_id: aggregateId.organisation_id},
      pointInTime
    );

    return new OrganisationJobAggregate(
      {name: aggregateId.name, agency_id: aggregateId.agency_id, organisation_id: aggregateId.organisation_id},
      projection
    );
  }
}
