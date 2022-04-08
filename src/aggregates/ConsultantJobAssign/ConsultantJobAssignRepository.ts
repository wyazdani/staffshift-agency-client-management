import {ConsultantJobAssignAggregate} from './ConsultantJobAssignAggregate';
import {EventRepository} from '../../EventRepository';
import {ConsultantJobAssignAggregateIdInterface, ConsultantJobAssignAggregateRecordInterface} from './types';
import {ConsultantJobAssignWriteProjectionHandler} from './ConsultantJobAssignWriteProjectionHandler';
import {AbstractRepository} from '../AbstractRepository';

/**
 * Class responsible for interacting with aggregate data source
 */
export class ConsultantJobAssignRepository extends AbstractRepository {
  constructor(
    protected eventRepository: EventRepository,
    private projectionHandler: ConsultantJobAssignWriteProjectionHandler
  ) {
    super(eventRepository);
  }

  async getAggregate(
    aggregateId: ConsultantJobAssignAggregateIdInterface,
    sequenceId: number = undefined
  ): Promise<ConsultantJobAssignAggregate> {
    const projection: ConsultantJobAssignAggregateRecordInterface = await this.eventRepository.leftFoldEvents(
      this.projectionHandler,
      {
        name: aggregateId.name,
        agency_id: aggregateId.agency_id,
        job_id: aggregateId.job_id
      },
      sequenceId
    );

    return new ConsultantJobAssignAggregate(
      {
        name: aggregateId.name,
        agency_id: aggregateId.agency_id,
        job_id: aggregateId.job_id
      },
      projection
    );
  }
}
