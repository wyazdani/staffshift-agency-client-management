import {reduce, map} from 'lodash';
import {FilterQuery, Model} from 'mongoose';
import {AgencyClientCommandDataType} from './AgencyClient/types/AgencyClientCommandDataType';
import {EventStoreDocumentType} from './models/EventStore';
import {AgencyCommandDataType} from './Agency/types/AgencyCommandDataType';
import {WriteProjectionInterface} from './WriteProjectionInterface';
import {BaseAggregateRecordInterface} from 'BaseAggregateRecordInterface';
import {BaseAggregateIdInterface} from 'BaseAggregateIdInterface';

// Might be worth having a UserEventMeta and SystemEventMeta concept
export interface EventMetaInterface {
  user_id: string;
  client_id?: string;
  context?: {
    type: string;
    id?: string;
  };
}

export interface BaseEventInterface {
  correlation_id: string;
  meta_data: {
    user_id: string;
    client_id?: string;
    context?: {
      type: string;
      id?: string;
    };
  };
}

interface BaseProjectionInterface {
  last_sequence_id: number;
}

interface EventInterface<AggregateId, EventData> {
  type: string;
  aggregate_id: AggregateId;
  data: EventData;
  sequence_id: number;
}

/**
 * EventRepository
 *   Should the EventStore be passed in here?
 *   How would we handle snapshots? Pass a list of possible "stores"?
 *   How do we build snapshots in the background and use them when they are ready?
 */
export class EventRepository<
  AggregateIdType extends BaseAggregateIdInterface,
  EventData extends AgencyCommandDataType | AgencyClientCommandDataType,
  AggregateType extends BaseAggregateRecordInterface
> {
  constructor(
    private store: Model<EventStoreDocumentType<AggregateIdType, EventData>>,
    private correlation_id: string,
    private eventMeta?: EventMetaInterface
  ) {}

  async leftFoldEvents(
    writeProjectionHandler: WriteProjectionInterface<EventData>,
    aggregateId: AggregateIdType,
    sequenceId: number = undefined
  ): Promise<BaseProjectionInterface> {
    const query: FilterQuery<EventStoreDocumentType<AggregateIdType, EventData>> = {aggregate_id: aggregateId};

    if (sequenceId) {
      query['sequence_id'] = {$lte: sequenceId};
    }
    const events: EventStoreDocumentType<AggregateIdType, EventData>[] = await this.store
      .find(query)
      .sort({sequence_id: 1})
      .lean();

    return reduce(
      events,
      (acc: AggregateType, event: EventStoreDocumentType<AggregateIdType, EventData>) =>
        writeProjectionHandler.execute(event.type, acc, event),
      {last_sequence_id: 0}
    );
  }

  /**
   * Persist events into event store collection
   */
  async save(
    events: EventInterface<AggregateIdType, EventData>[]
  ): Promise<EventStoreDocumentType<AggregateIdType, EventData>[]> {
    const enrichedEvents: (EventInterface<AggregateIdType, EventData> & BaseEventInterface)[] = map(
      events,
      (aggEvent) => ({
        ...aggEvent,
        correlation_id: this.correlation_id,
        meta_data: this.eventMeta
      })
    );

    return this.store.insertMany(enrichedEvents);
  }
}
