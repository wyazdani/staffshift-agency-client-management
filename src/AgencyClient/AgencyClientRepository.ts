import {AgencyClientAggregate} from './AgencyClientAggregate';
import {AgencyRepository} from '../Agency/AgencyRepository';
import {AgencyClientWriteProjection} from './AgencyClientWriteProjection';
import {EventRepository} from '../EventRepository';
import {AgencyClientAggregateRecordInterface, AgencyClientEventInterface} from './types';

export class AgencyClientRepository {
  constructor(private eventRepository: EventRepository) {}

  async getAggregate(
    agencyId: string,
    clientId: string,
    sequenceId: number = undefined
  ): Promise<AgencyClientAggregate> {
    const projection: AgencyClientAggregateRecordInterface = await this.eventRepository.leftFoldEvents(
      AgencyClientWriteProjection,
      {agency_id: agencyId, client_id: clientId},
      sequenceId
    );

    return new AgencyClientAggregate(
      {agency_id: agencyId, client_id: clientId},
      projection,
      new AgencyRepository(this.eventRepository)
    );
  }

  async save(events: AgencyClientEventInterface[]): Promise<any[]> {
    return this.eventRepository.save(events);
  }
}
