import {EventsEnum} from '../Events';
import {EventStoreModelInterface} from '../models/EventStore';
import {BaseAggregateRecordInterface} from 'BaseAggregateRecordInterface';

export interface WriteProjectionInterface<T extends BaseAggregateRecordInterface> {
  execute(type: EventsEnum, aggregate: T, event: EventStoreModelInterface): T;
}
