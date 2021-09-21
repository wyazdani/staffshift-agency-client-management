import {reduce} from 'lodash';
import {AgencyWriteProjection} from './AgencyWriteProjection';
import {AgencyAggregate} from './AgencyAggregate';
import {Model, FilterQuery} from 'mongoose';
import {AgencyAggregateRecordInterface, AgencyEventInterface} from './Interfaces';

export class AgencyRepository {
  constructor(private store: Model<any>) {
  }

  async getAggregate(agencyId: string, sequenceId: number = undefined): Promise<AgencyAggregate> {
    const query: FilterQuery<any> = {aggregate_id: {agency_id: agencyId}};
    if (sequenceId) {
      query['sequence_id'] = {$lte: sequenceId};
    }
    const events: AgencyEventInterface[] = await this.store.find(query).sort({sequence_id: 1}).lean();
    return new AgencyAggregate(
      {agency_id: agencyId},
      reduce(events, eventApplier, {last_sequence_id: 0})
    );
  }

  async save(events: AgencyEventInterface[]): Promise<any[]> {
    return this.store.insertMany(events, {lean: true});
  }
}

const eventApplier =
  (aggregate: AgencyAggregateRecordInterface, event: AgencyEventInterface): AgencyAggregateRecordInterface =>
    AgencyWriteProjection[event.type](aggregate, event);
