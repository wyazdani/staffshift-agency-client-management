import {AbstractRepository} from '../AbstractRepository';
import {AgencyAggregate} from './AgencyAggregate';
import {EventRepository} from '../../EventRepository';
import {AgencyAggregateRecordInterface} from './types';
import {AgencyWriteProjectionHandler} from './AgencyWriteProjectionHandler';

/**
 * Class responsible for interacting with agency aggregate data source
 */
export class AgencyRepository extends AbstractRepository {
  constructor(
    protected eventRepository: EventRepository,
    private writeProjectionHandler: AgencyWriteProjectionHandler
  ) {
    super(eventRepository);
  }

  /**
   * Build and return agency aggregate
   */
  async getAggregate(agencyId: string, sequenceId: number = undefined): Promise<AgencyAggregate> {
    const projection: AgencyAggregateRecordInterface = await this.eventRepository.leftFoldEvents(
      this.writeProjectionHandler,
      {agency_id: agencyId},
      sequenceId
    );

    return new AgencyAggregate({agency_id: agencyId}, projection);
  }
}
