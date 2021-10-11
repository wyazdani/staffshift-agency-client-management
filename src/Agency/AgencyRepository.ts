import {AgencyAggregate} from './AgencyAggregate';
import {EventRepository, EventInterface} from '../EventRepository';
import {AgencyAggregateRecordInterface} from './types';
import {EventStoreModelInterface} from '../models/EventStore';
import {AgencyWriteProjectionHandler} from './AgencyWriteProjection';

/**
 * Class responsible for interacting with agency aggregate data source
 */
export class AgencyRepository {
  constructor(private eventRepository: EventRepository, private writeProjectionHandler: AgencyWriteProjectionHandler) {}

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
  async save(events: EventInterface[]): Promise<EventStoreModelInterface[]> {
    return this.eventRepository.save(events);
  }
}
