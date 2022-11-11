import {ClientInheritanceProcessAggregate} from './ClientInheritanceProcessAggregate';
import {EventRepository, EventPointInTimeType} from '../../EventRepository';
import {ClientInheritanceProcessAggregateIdInterface, ClientInheritanceProcessAggregateRecordInterface} from './types';
import {ClientInheritanceProcessWriteProjectionHandler} from './ClientInheritanceProcessWriteProjectionHandler';
import {AbstractRepository} from '../AbstractRepository';

/**
 * Class responsible for interacting with aggregate data source
 */
export class ClientInheritanceProcessRepository extends AbstractRepository<ClientInheritanceProcessAggregate> {
  constructor(
    protected eventRepository: EventRepository,
    private projectionHandler: ClientInheritanceProcessWriteProjectionHandler
  ) {
    super(eventRepository);
  }

  async getAggregate(
    aggregateId: ClientInheritanceProcessAggregateIdInterface,
    pointInTime?: EventPointInTimeType
  ): Promise<ClientInheritanceProcessAggregate> {
    const projection: ClientInheritanceProcessAggregateRecordInterface = await this.eventRepository.leftFoldEvents(
      this.projectionHandler,
      {
        name: aggregateId.name,
        agency_id: aggregateId.agency_id,
        job_id: aggregateId.job_id
      },
      pointInTime
    );

    return new ClientInheritanceProcessAggregate(
      {
        name: aggregateId.name,
        agency_id: aggregateId.agency_id,
        job_id: aggregateId.job_id
      },
      projection
    );
  }
}
