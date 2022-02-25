import {AgencyClientAggregate} from './AgencyClientAggregate';
import {AgencyRepository} from '../Agency/AgencyRepository';
import {EventRepository, EventInterface} from '../../EventRepository';
import {AgencyClientAggregateRecordInterface} from './types';
import {EventStoreModelInterface} from '../../models/EventStore';
import {AgencyClientWriteProjectionHandler} from './AgencyClientWriteProjectionHandler';

/**
 * Class responsible for interacting with agency client aggregate data source
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

    return new AgencyClientAggregate({agency_id: agencyId, client_id: clientId}, projection, this.agencyRepository);
  }

  /**
   * Persist agency client related events into event store
   */
  async save(events: EventInterface[]): Promise<EventStoreModelInterface[]> {
    return this.eventRepository.save(events);
  }
}
