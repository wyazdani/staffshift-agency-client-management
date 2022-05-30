import {AgencyClientAggregate} from './AgencyClientAggregate';
import {AgencyRepository} from '../Agency/AgencyRepository';
import {EventRepository, EventPointInTimeType} from '../../EventRepository';
import {AgencyClientAggregateIdInterface, AgencyClientAggregateRecordInterface} from './types';
import {AgencyClientWriteProjectionHandler} from './AgencyClientWriteProjectionHandler';
import {AbstractRepository} from '../AbstractRepository';

/**
 * Class responsible for interacting with agency client aggregate data source
 */
export class AgencyClientRepository extends AbstractRepository {
  constructor(
    protected eventRepository: EventRepository,
    private agencyClientWriteProjectionHandler: AgencyClientWriteProjectionHandler,
    private agencyRepository: AgencyRepository
  ) {
    super(eventRepository);
  }

  async getAggregate(
    aggregateId: AgencyClientAggregateIdInterface,
    pointInTime?: EventPointInTimeType
  ): Promise<AgencyClientAggregate> {
    const projection: AgencyClientAggregateRecordInterface = await this.eventRepository.leftFoldEvents(
      this.agencyClientWriteProjectionHandler,
      {agency_id: aggregateId.agency_id, client_id: aggregateId.client_id},
      pointInTime
    );

    return new AgencyClientAggregate(
      {agency_id: aggregateId.agency_id, client_id: aggregateId.client_id},
      projection,
      this.agencyRepository
    );
  }
}
