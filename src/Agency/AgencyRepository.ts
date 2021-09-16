import _ from 'lodash';
import {AgencyWriteProjection} from './AgencyWriteProjection';
import {AgencyAggregate} from './AgencyAggregate';
import {Model, FilterQuery} from 'mongoose';
import {AgencyAggregateRecord, AgencyEvent} from './Interfaces';
import { EventRepository } from '../EventRepository';

export class AgencyRepository {
  constructor(private eventRepository: EventRepository) {
  }

  async getAggregate(agencyId: string, sequenceId: number = undefined): Promise<AgencyAggregate> {
    const projection = await this.eventRepository.leftFoldEvents(AgencyWriteProjection, {agency_id: agencyId}, sequenceId);
    return new AgencyAggregate({agency_id: agencyId}, projection);
  }

  async save(events: AgencyEvent[]): Promise<any[]> {
    return this.eventRepository.save(events);
  }
}