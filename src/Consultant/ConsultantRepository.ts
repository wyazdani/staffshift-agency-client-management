import {AgencyRepository} from '../Agency/AgencyRepository';
import {ConsultantAggregate} from './ConsultantAggregate';
import {EventRepository, EventInterface} from '../EventRepository';
import {ConsultantAggregateRecordInterface} from './types';
import {EventStoreModelInterface} from '../models/EventStore';
import {ConsultantWriteProjectionHandler} from './ConsultantWriteProjectionHandler';

/**
 * Class responsible for interacting with aggregate data source
 */
export class ConsultantRepository {
  private static readonly AGGREGATE_ID_NAME = 'Consultant';
  constructor(
    private eventRepository: EventRepository,
    private projectionHandler: ConsultantWriteProjectionHandler,
    private agencyRepository: AgencyRepository
  ) {}

  async getAggregate(agencyId: string, sequenceId: number = undefined): Promise<ConsultantAggregate> {
    const projection: ConsultantAggregateRecordInterface = await this.eventRepository.leftFoldEvents(
      this.projectionHandler,
      {name: ConsultantRepository.AGGREGATE_ID_NAME, agency_id: agencyId},
      sequenceId
    );

    return new ConsultantAggregate(
      {name: ConsultantRepository.AGGREGATE_ID_NAME, agency_id: agencyId},
      projection,
      this.agencyRepository
    );
  }

  /**
   * Persist related events into event store
   */
  async save(events: EventInterface[]): Promise<EventStoreModelInterface[]> {
    return this.eventRepository.save(events);
  }
}
