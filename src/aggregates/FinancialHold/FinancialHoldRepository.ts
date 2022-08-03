import {FinancialHoldAggregate} from './FinancialHoldAggregate';
import {EventRepository, EventPointInTimeType} from '../../EventRepository';
import {FinancialHoldAggregateIdInterface, FinancialHoldAggregateRecordInterface} from './types';
import {FinancialHoldWriteProjectionHandler} from './FinancialHoldWriteProjectionHandler';
import {AbstractRepository} from '../AbstractRepository';

/**
 * Class responsible for interacting with aggregate data source
 */
export class FinancialHoldRepository extends AbstractRepository {
  constructor(
    protected eventRepository: EventRepository,
    private projectionHandler: FinancialHoldWriteProjectionHandler
  ) {
    super(eventRepository);
  }

  async getAggregate(
    aggregateId: FinancialHoldAggregateIdInterface,
    pointInTime?: EventPointInTimeType
  ): Promise<FinancialHoldAggregate> {
    const projection: FinancialHoldAggregateRecordInterface = await this.eventRepository.leftFoldEvents(
      this.projectionHandler,
      {name: aggregateId.name, agency_id: aggregateId.agency_id, client_id: aggregateId.client_id},
      pointInTime
    );

    return new FinancialHoldAggregate(
      {name: aggregateId.name, agency_id: aggregateId.agency_id, client_id: aggregateId.client_id},
      projection
    );
  }
}
