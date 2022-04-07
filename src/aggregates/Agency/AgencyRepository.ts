import {AbstractRepository} from '../AbstractRepository';
import {AgencyAggregate} from './AgencyAggregate';
import {EventRepository} from '../../EventRepository';
import {AgencyAggregateIdInterface, AgencyAggregateRecordInterface} from './types';
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
  async getAggregate(
    aggregateId: AgencyAggregateIdInterface,
    sequenceId: number = undefined
  ): Promise<AgencyAggregate> {
    const projection: AgencyAggregateRecordInterface = await this.eventRepository.leftFoldEvents(
      this.writeProjectionHandler,
      aggregateId,
      sequenceId
    );

    return new AgencyAggregate(aggregateId, projection);
  }
}
