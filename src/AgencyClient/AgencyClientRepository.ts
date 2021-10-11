import {AgencyClientAggregate} from './AgencyClientAggregate';
import {AgencyRepository} from '../Agency/AgencyRepository';
import {EventRepository, EventInterface} from '../EventRepository';
import {AgencyClientAggregateRecordInterface} from './types';
import {EventStoreModelInterface} from '../models/EventStore';
import {AgencyClientWriteProjectionHandler} from './AgencyClientWriteProjectionHandler';

/**
 * TODO
 */
export class AgencyClientRepository {
  constructor(
    private eventRepository: EventRepository,
    private agencyClientWriteProjectionHandler: AgencyClientWriteProjectionHandler,
    private agencyRepository: AgencyRepository
  ) {}

  async getAggregate(
    agencyId: string,
    clientId: string,
    sequenceId: number = undefined
  ): Promise<AgencyClientAggregate> {
    const projection: AgencyClientAggregateRecordInterface = await this.eventRepository.leftFoldEvents(
      this.agencyClientWriteProjectionHandler,
      {agency_id: agencyId, client_id: clientId},
      sequenceId
    );

    const agencyAggregate = await this.agencyRepository.getAggregate(agencyId);

    return new AgencyClientAggregate({agency_id: agencyId, client_id: clientId}, projection, agencyAggregate);
  }

  async save(events: EventInterface[]): Promise<EventStoreModelInterface[]> {
    return this.eventRepository.save(events);
  }
}
