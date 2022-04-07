import {AgencyClientAggregate} from './AgencyClientAggregate';
import {AgencyRepository} from '../Agency/AgencyRepository';
import {EventRepository, EventInterface} from '../../EventRepository';
import {AgencyClientAggregateIdInterface, AgencyClientAggregateRecordInterface} from './types';
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
    aggregateId: AgencyClientAggregateIdInterface,
    sequenceId: number = undefined
  ): Promise<AgencyClientAggregate> {
    const projection: AgencyClientAggregateRecordInterface = await this.eventRepository.leftFoldEvents(
      this.agencyClientWriteProjectionHandler,
      aggregateId,
      sequenceId
    );

    return new AgencyClientAggregate(aggregateId, projection, this.agencyRepository);
  }

  /**
   * Persist agency client related events into event store
   */
  async save(events: EventInterface[]): Promise<EventStoreModelInterface[]> {
    return this.eventRepository.save(events);
  }
}
