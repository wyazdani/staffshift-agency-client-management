import {BookingPreferenceAggregate} from './BookingPreferenceAggregate';
import {EventRepository, EventPointInTimeType} from '../../EventRepository';
import {BookingPreferenceAggregateIdInterface, BookingPreferenceAggregateRecordInterface} from './types';
import {BookingPreferenceWriteProjectionHandler} from './BookingPreferenceWriteProjectionHandler';
import {AbstractRepository} from '../AbstractRepository';

/**
 * Class responsible for interacting with aggregate data source
 */
export class BookingPreferenceRepository extends AbstractRepository<BookingPreferenceAggregate> {
  private static readonly AGGREGATE_ID_NAME = 'booking_preference';
  constructor(
    protected eventRepository: EventRepository,
    private projectionHandler: BookingPreferenceWriteProjectionHandler
  ) {
    super(eventRepository);
  }

  async getAggregate(
    aggregateId: BookingPreferenceAggregateIdInterface,
    pointInTime?: EventPointInTimeType
  ): Promise<BookingPreferenceAggregate> {
    const projection: BookingPreferenceAggregateRecordInterface = await this.eventRepository.leftFoldEvents(
      this.projectionHandler,
      {name: aggregateId.name, agency_id: aggregateId.agency_id, client_id: aggregateId.client_id},
      pointInTime
    );

    return new BookingPreferenceAggregate(
      {name: aggregateId.name, agency_id: aggregateId.agency_id, client_id: aggregateId.client_id},
      projection
    );
  }
}
