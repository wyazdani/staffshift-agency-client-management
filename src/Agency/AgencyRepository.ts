import _ from 'lodash';
import {AgencyWriteProjection} from './AgencyWriteProjection'
import {AgencyAggregate} from './AgencyAggregate';
import {Model, FilterQuery} from 'mongoose';
import {AgencyAggregateRecord, AgencyEvent} from "./Interfaces";

export class AgencyRepository {
  store: Model<any>;
  constructor(store: Model<any>) {
    this.store = store;
  }

  async getAggregate(agencyId: string, sequenceId: number = undefined): Promise<AgencyAggregate> {
    const query: FilterQuery<any> = {aggregate_id: {agency_id: agencyId}};
    if (sequenceId) {
      query['sequence_id'] = {$lte: sequenceId};
    }
    const events: AgencyEvent[] = await this.store.find(query).sort({sequence_id: 1}).lean();
    return new AgencyAggregate(
      {agency_id: agencyId},
      _.reduce(events, eventApplier, {last_sequence_id: 0})
    );
  }

  async save(events: AgencyEvent[]): Promise<any[]> {
    return this.store.insertMany(events, {lean: true});
  }
}

const eventApplier = (aggregate: AgencyAggregateRecord, event: AgencyEvent): AgencyAggregateRecord => {
  return AgencyWriteProjection[event.type](aggregate, event);
};
