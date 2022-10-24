import {AbstractRepository} from '../AbstractRepository';
import {AgencyAggregate} from './AgencyAggregate';
import {EventRepository, EventPointInTimeType} from '../../EventRepository';
import {AgencyAggregateIdInterface, AgencyAggregateRecordInterface} from './types';
import {AgencyWriteProjectionHandler} from './AgencyWriteProjectionHandler';

/**
 * Class responsible for interacting with agency aggregate data source
 */
export class AgencyRepository extends AbstractRepository<AgencyAggregate> {
  constructor(
    protected eventRepository: EventRepository,
    private writeProjectionHandler: AgencyWriteProjectionHandler
  ) {
    super(eventRepository);
  }

  /**
   * Build and return agency aggregate
   */
  async getAggregate(
    aggregateId: AgencyAggregateIdInterface,
    pointInTime?: EventPointInTimeType
  ): Promise<AgencyAggregate> {
    const projection: AgencyAggregateRecordInterface = await this.eventRepository.leftFoldEvents(
      this.writeProjectionHandler,
      {agency_id: aggregateId.agency_id},
      pointInTime
    );

    return new AgencyAggregate({agency_id: aggregateId.agency_id}, projection);
  }
}
