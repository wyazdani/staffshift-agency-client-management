import {AgencyClientAggregate} from './AgencyClientAggregate';
import {AgencyRepository} from '../Agency/AgencyRepository';
import {EventRepository} from '../EventRepository';
import {
  AgencyClientAggregateIdInterface,
  AgencyClientAggregateRecordInterface,
  AgencyClientEventInterface
} from './types';
import {AgencyClientCommandDataType} from './types/AgencyClientCommandDataType';
import {EventStoreDocumentType} from '../models/EventStore';
import {AgencyClientWriteProjectionHandler} from './AgencyClientWriteProjectionHandler';

/**
 * TODO
 */
export class AgencyClientRepository {
  constructor(
    private eventRepository: EventRepository<
      AgencyClientAggregateIdInterface,
      AgencyClientCommandDataType,
      AgencyClientAggregateRecordInterface
    >,
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

    const agencyAggregate = await this.agencyRepository.getAggregate(agencyId);

    return new AgencyClientAggregate({agency_id: agencyId, client_id: clientId}, projection, agencyAggregate);
  }

  async save(
    events: AgencyClientEventInterface<AgencyClientCommandDataType>[]
  ): Promise<EventStoreDocumentType<AgencyClientAggregateIdInterface, AgencyClientCommandDataType>[]> {
    return this.eventRepository.save(events);
  }
}
