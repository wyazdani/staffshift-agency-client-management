import {AgencyRepository} from '../Agency/AgencyRepository';
import {ConsultantJobAggregate} from './ConsultantJobAggregate';
import {EventRepository} from '../../EventRepository';
import {ConsultantJobAggregateIdInterface, ConsultantJobAggregateRecordInterface} from './types';
import {ConsultantJobWriteProjectionHandler} from './ConsultantJobWriteProjectionHandler';
import {AbstractRepository} from '../AbstractRepository';

/**
 * Class responsible for interacting with aggregate data source
 */
export class ConsultantJobRepository extends AbstractRepository {
  constructor(
    protected eventRepository: EventRepository,
    private projectionHandler: ConsultantJobWriteProjectionHandler,
    private agencyRepository: AgencyRepository
  ) {
    super(eventRepository);
  }

  async getAggregate(
    aggregateId: ConsultantJobAggregateIdInterface,
    sequenceId: number = undefined
  ): Promise<ConsultantJobAggregate> {
    const projection: ConsultantJobAggregateRecordInterface = await this.eventRepository.leftFoldEvents(
      this.projectionHandler,
      {name: aggregateId.name, agency_id: aggregateId.agency_id},
      sequenceId
    );

    return new ConsultantJobAggregate(
      {name: aggregateId.name, agency_id: aggregateId.agency_id},
      projection,
      this.agencyRepository
    );
  }
}
