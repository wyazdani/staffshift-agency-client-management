import {AgencyRepository} from '../Agency/AgencyRepository';
import {ConsultantJobAggregate} from './ConsultantJobAggregate';
import {EventRepository, EventPointInTimeType} from '../../EventRepository';
import {ConsultantJobAggregateIdInterface, ConsultantJobAggregateRecordInterface} from './types';
import {ConsultantJobWriteProjectionHandler} from './ConsultantJobWriteProjectionHandler';
import {AbstractRepository} from '../AbstractRepository';

/**
 * Class responsible for interacting with aggregate data source
 */
export class ConsultantJobRepository extends AbstractRepository<ConsultantJobAggregate> {
  constructor(
    protected eventRepository: EventRepository,
    private projectionHandler: ConsultantJobWriteProjectionHandler,
    private agencyRepository: AgencyRepository
  ) {
    super(eventRepository);
  }

  async getAggregate(
    aggregateId: ConsultantJobAggregateIdInterface,
    pointInTime?: EventPointInTimeType
  ): Promise<ConsultantJobAggregate> {
    const projection: ConsultantJobAggregateRecordInterface = await this.eventRepository.leftFoldEvents(
      this.projectionHandler,
      {name: aggregateId.name, agency_id: aggregateId.agency_id},
      pointInTime
    );

    return new ConsultantJobAggregate(
      {name: aggregateId.name, agency_id: aggregateId.agency_id},
      projection,
      this.agencyRepository
    );
  }
}
