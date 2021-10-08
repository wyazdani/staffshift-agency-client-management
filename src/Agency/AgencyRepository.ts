import {AgencyAggregate} from './AgencyAggregate';
import {EventRepository} from '../EventRepository';
import {AgencyAggregateIdInterface, AgencyAggregateRecordInterface, AgencyEventInterface} from './types';
import {EventStoreDocumentType} from '../models/EventStore';
import {AgencyCommandDataType} from './types/AgencyCommandDataType';
import {AgencyWriteProjectionHandler} from './AgencyWriteProjection';

/**
 * Class responsible for interacting with agency aggregate data source
 */
export class AgencyRepository {
  constructor(
    private eventRepository: EventRepository<
      AgencyAggregateIdInterface,
      AgencyCommandDataType,
      AgencyAggregateRecordInterface
    >,
    private writeProjectionHandler: AgencyWriteProjectionHandler
  ) {}

  /**
   * Build and return agency aggregate
   */
  async getAggregate(agencyId: string, sequenceId: number = undefined): Promise<AgencyAggregate> {
    const projection: AgencyAggregateRecordInterface = await this.eventRepository.leftFoldEvents(
      this.writeProjectionHandler,
      {agency_id: agencyId},
      sequenceId
    );

    return new AgencyAggregate({agency_id: agencyId}, projection);
  }

  /**
   * Persist agency related events into event store
   * EventStoreDocumentType<AggregateIdType, EventData>
   */
  async save(
    events: AgencyEventInterface<AgencyCommandDataType>[]
  ): Promise<EventStoreDocumentType<AgencyAggregateIdInterface, AgencyCommandDataType>[]> {
    return this.eventRepository.save(events);
  }
}
