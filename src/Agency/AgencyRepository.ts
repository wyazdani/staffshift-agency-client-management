import {AgencyWriteProjection} from './AgencyWriteProjection';
import {AgencyAggregate} from './AgencyAggregate';
import {EventRepository} from '../EventRepository';
import {AgencyAggregateRecordInterface, AgencyEventInterface} from './types';

export class AgencyRepository {
  constructor(private eventRepository: EventRepository) {}

  async getAggregate(agencyId: string, sequenceId: number = undefined): Promise<AgencyAggregate> {
    const projection: AgencyAggregateRecordInterface = await this.eventRepository.leftFoldEvents(
      AgencyWriteProjection,
      {agency_id: agencyId},
      sequenceId
    );

    return new AgencyAggregate({agency_id: agencyId}, projection);
  }

  async save(events: AgencyEventInterface[]): Promise<any[]> {
    return this.eventRepository.save(events);
  }
}
