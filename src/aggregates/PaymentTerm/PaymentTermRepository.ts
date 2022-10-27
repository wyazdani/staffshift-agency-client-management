import {PaymentTermAggregate} from './PaymentTermAggregate';
import {EventRepository, EventPointInTimeType} from '../../EventRepository';
import {PaymentTermAggregateIdInterface, PaymentTermAggregateRecordInterface} from './types';
import {PaymentTermWriteProjectionHandler} from './PaymentTermWriteProjectionHandler';
import {AbstractRepository} from '../AbstractRepository';

/**
 * Class responsible for interacting with aggregate data source
 */
export class PaymentTermRepository extends AbstractRepository<PaymentTermAggregate> {
  constructor(
    protected eventRepository: EventRepository,
    private projectionHandler: PaymentTermWriteProjectionHandler
  ) {
    super(eventRepository);
  }

  async getAggregate(
    aggregateId: PaymentTermAggregateIdInterface,
    pointInTime?: EventPointInTimeType
  ): Promise<PaymentTermAggregate> {
    const projection: PaymentTermAggregateRecordInterface = await this.eventRepository.leftFoldEvents(
      this.projectionHandler,
      {name: aggregateId.name, agency_id: aggregateId.agency_id, client_id: aggregateId.client_id},
      pointInTime
    );

    return new PaymentTermAggregate(
      {name: aggregateId.name, agency_id: aggregateId.agency_id, client_id: aggregateId.client_id},
      projection
    );
  }
}
