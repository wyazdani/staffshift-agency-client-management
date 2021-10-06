import {AgencyWriteProjection} from './AgencyWriteProjection';
import {AgencyAggregate} from './AgencyAggregate';
import {EventRepository} from '../EventRepository';
import {AgencyAggregateRecordInterface, AgencyEventInterface} from './types';

/**
 * Class responsible for interacting with agency aggregate data source
 */
export class AgencyRepository {
  constructor(private eventRepository: EventRepository) {}

  /**
   * Build and return agency aggregate
   */
  async getAggregate(agencyId: string, sequenceId: number = undefined): Promise<AgencyAggregate> {
    const projection: AgencyAggregateRecordInterface = await this.eventRepository.leftFoldEvents(
      AgencyWriteProjection,
      {agency_id: agencyId},
      sequenceId
    );

    return new AgencyAggregate({agency_id: agencyId}, projection);
  }

  /**
   * Persist agency related events into event store
   */
  async save(events: AgencyEventInterface[]): Promise<any[]> {
    return this.eventRepository.save(events);
  }
}
