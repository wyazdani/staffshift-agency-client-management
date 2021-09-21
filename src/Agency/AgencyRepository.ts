import {reduce} from 'lodash';
import {AgencyWriteProjection} from './AgencyWriteProjection';
import {AgencyAggregate} from './AgencyAggregate';
import {AgencyAggregateRecordInterface, AgencyEventInterface} from './Interfaces';
import { EventRepository } from '../EventRepository';

export class AgencyRepository {
  constructor(private eventRepository: EventRepository) {
  }

  async getAggregate(agencyId: string, sequenceId: number = undefined): Promise<AgencyAggregate> {
    const projection: AgencyAggregateRecord = await this.eventRepository.leftFoldEvents(
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