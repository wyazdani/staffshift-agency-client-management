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

export class AgencyClientRepository {
  constructor(private eventRepository: EventRepository) {}

  async getAggregate(
    agencyId: string,
    clientId: string,
    sequenceId: number = undefined
  ): Promise<AgencyClientAggregate> {
    const projection: AgencyClientAggregateRecordInterface = await this.eventRepository.leftFoldEvents<
      AgencyClientAggregateIdInterface,
      AgencyClientEventInterface<AgencyClientCommandDataType>
    >({agency_id: agencyId, client_id: clientId}, sequenceId);

    return new AgencyClientAggregate(
      {agency_id: agencyId, client_id: clientId},
      projection,
      new AgencyRepository(this.eventRepository)
    );
  }

  async save(events: AgencyClientEventInterface<AgencyClientCommandDataType>[]): Promise<EventStoreDocumentType[]> {
    return this.eventRepository.save<AgencyClientEventInterface<AgencyClientCommandDataType>>(events);
  }
}
