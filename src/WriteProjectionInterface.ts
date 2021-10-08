import {BaseAggregateIdInterface} from './Agency/types/AgencyAggregateIdInterface';
import {BaseAggregateRecordInterface} from './Agency/types/AgencyAggregateRecordInterface';
import {EventsEnum} from './Events';
import {EventStoreDocumentType} from './models/EventStore';

export interface WriteProjectionInterface<CommandDataType> {
  execute(
    type: EventsEnum,
    aggregate: BaseAggregateRecordInterface,
    event: EventStoreDocumentType<BaseAggregateIdInterface, CommandDataType>
  ): BaseAggregateRecordInterface;
}
