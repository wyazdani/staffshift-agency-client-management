import {AgencyClientAggregate} from './AgencyClientAggregate';
import {AgencyRepository} from '../Agency/AgencyRepository';
import {EventRepository} from '../../EventRepository';
import {AgencyClientAggregateIdInterface, AgencyClientAggregateRecordInterface} from './types';
import {AgencyClientWriteProjectionHandler} from './AgencyClientWriteProjectionHandler';
import {AbstractRepository} from '../AbstractRepository';

/**
 * Class responsible for interacting with agency client aggregate data source
 */
export class AgencyClientRepository extends AbstractRepository {
  constructor(
    protected eventRepository: EventRepository,
    private agencyClientWriteProjectionHandler: AgencyClientWriteProjectionHandler,
    private agencyRepository: AgencyRepository
  ) {
    super(eventRepository);
  }

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
}
