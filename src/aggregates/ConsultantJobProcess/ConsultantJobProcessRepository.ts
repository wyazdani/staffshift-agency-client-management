import {ConsultantJobProcessAggregate} from './ConsultantJobProcessAggregate';
import {EventRepository, EventPointInTimeType} from '../../EventRepository';
import {ConsultantJobProcessAggregateIdInterface, ConsultantJobProcessAggregateRecordInterface} from './types';
import {ConsultantJobProcessWriteProjectionHandler} from './ConsultantJobProcessWriteProjectionHandler';
import {AbstractRepository} from '../AbstractRepository';

/**
 * Class responsible for interacting with aggregate data source
 */
export class ConsultantJobProcessRepository extends AbstractRepository<ConsultantJobProcessAggregate> {
  constructor(
    protected eventRepository: EventRepository,
    private projectionHandler: ConsultantJobProcessWriteProjectionHandler
  ) {
    super(eventRepository);
  }

  async getAggregate(
    aggregateId: ConsultantJobProcessAggregateIdInterface,
    pointInTime?: EventPointInTimeType
  ): Promise<ConsultantJobProcessAggregate> {
    const projection: ConsultantJobProcessAggregateRecordInterface = await this.eventRepository.leftFoldEvents(
      this.projectionHandler,
      {
        name: aggregateId.name,
        agency_id: aggregateId.agency_id,
        job_id: aggregateId.job_id
      },
      pointInTime
    );

    return new ConsultantJobProcessAggregate(
      {
        name: aggregateId.name,
        agency_id: aggregateId.agency_id,
        job_id: aggregateId.job_id
      },
      projection
    );
  }
}
