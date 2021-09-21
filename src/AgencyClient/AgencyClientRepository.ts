import {reduce} from 'lodash';
import {Model, FilterQuery} from 'mongoose';
import {AgencyClientAggregateRecordInterface, AgencyClientEventInterface} from './Interfaces';
import {AgencyClientAggregate} from './AgencyClientAggregate';
import {AgencyRepository} from '../Agency/AgencyRepository';
import {AgencyClientWriteProjection} from './AgencyClientWriteProjection';

export class AgencyClientRepository {
  constructor(private store: Model<any>) {
  }

  async getAggregate(agencyId: string, clientId: string, sequenceId: number = undefined): Promise<AgencyClientAggregate> {
    const query: FilterQuery<any> = {aggregate_id: {agency_id: agencyId, client_id: clientId}};
    if (sequenceId) {
      query['sequence_id'] = {$lte: sequenceId};
    }
    const events = await this.store.find(query).sort({sequence_id: 1}).lean();

    return new AgencyClientAggregate(
      {agency_id: agencyId, client_id: clientId},
      reduce(events, eventApplier, {last_sequence_id: 0}),
      new AgencyRepository(this.store)
    );
  }

  async save(events: AgencyClientEventInterface[]): Promise<any[]> {
    return this.store.insertMany(events, {lean: true});
  }
}

const eventApplier = (aggregate: AgencyClientAggregateRecordInterface,
  event: AgencyClientEventInterface): AgencyClientAggregateRecordInterface =>
  AgencyClientWriteProjection[event.type](aggregate, event);
