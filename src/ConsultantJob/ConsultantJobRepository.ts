import {AgencyRepository} from '../Agency/AgencyRepository';
import {ConsultantJobAggregate} from './ConsultantJobAggregate';
import {EventRepository, EventInterface} from '../EventRepository';
import {ConsultantJobAggregateRecordInterface} from './types';
import {EventStoreModelInterface} from '../models/EventStore';
import {ConsultantJobWriteProjectionHandler} from './ConsultantJobWriteProjectionHandler';

/**
 * Class responsible for interacting with aggregate data source
 */
export class ConsultantJobRepository {
  private static readonly AGGREGATE_ID_NAME = 'consultant_job';
  constructor(
    private eventRepository: EventRepository,
    private projectionHandler: ConsultantJobWriteProjectionHandler,
    private agencyRepository: AgencyRepository
  ) {}

  async getAggregate(agencyId: string, sequenceId: number = undefined): Promise<ConsultantJobAggregate> {
    const projection: ConsultantJobAggregateRecordInterface = await this.eventRepository.leftFoldEvents(
      this.projectionHandler,
      {name: ConsultantJobRepository.AGGREGATE_ID_NAME, agency_id: agencyId},
      sequenceId
    );

    return new ConsultantJobAggregate(
      {name: ConsultantJobRepository.AGGREGATE_ID_NAME, agency_id: agencyId},
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
