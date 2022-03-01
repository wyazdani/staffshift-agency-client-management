import {ConsultantJobAssignAggregate} from './ConsultantJobAssignAggregate';
import {EventRepository, EventInterface} from '../../EventRepository';
import {ConsultantJobAssignAggregateRecordInterface} from './types';
import {EventStoreModelInterface} from '../../models/EventStore';
import {ConsultantJobAssignWriteProjectionHandler} from './ConsultantJobAssignWriteProjectionHandler';

/**
 * Class responsible for interacting with aggregate data source
 */
export class ConsultantJobAssignRepository {
  private static readonly AGGREGATE_ID_NAME = 'consultant_job_assign';
  constructor(
    private eventRepository: EventRepository,
    private projectionHandler: ConsultantJobAssignWriteProjectionHandler
  ) {}

  async getAggregate(
    agencyId: string,
    jobId: string,
    sequenceId: number = undefined
  ): Promise<ConsultantJobAssignAggregate> {
    const projection: ConsultantJobAssignAggregateRecordInterface = await this.eventRepository.leftFoldEvents(
      this.projectionHandler,
      {name: ConsultantJobAssignRepository.AGGREGATE_ID_NAME, agency_id: agencyId, job_id: jobId},
      sequenceId
    );

    return new ConsultantJobAssignAggregate(
      {name: ConsultantJobAssignRepository.AGGREGATE_ID_NAME, agency_id: agencyId, job_id: jobId},
      projection
    );
  }

  /**
   * Persist related events into event store
   */
  async save(events: EventInterface[]): Promise<EventStoreModelInterface[]> {
    return this.eventRepository.save(events);
  }
}
