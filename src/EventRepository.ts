import {reduce, map} from 'lodash';
import {FilterQuery, Model} from 'mongoose';
import {BaseAggregateIdInterface} from './Agency/types/AgencyAggregateIdInterface';
import {BaseAggregateRecordInterface} from './Agency/types/AgencyAggregateRecordInterface';
import {AgencyClientCommandDataType} from './AgencyClient/types/AgencyClientCommandDataType';
import {EventStoreDocumentType} from './models/EventStore';
import {WriteProjectionEventHandlerFactory} from './factories/WriteProjectionEventHandlerFactory';
import {AgencyWriteProjectionType, WriteProjection} from './Agency/AgencyWriteProjection';
import {AgencyClientWriteProjectionType} from './AgencyClient/AgencyClientWriteProjection';
import {AgencyAggregateIdInterface, AgencyAggregateRecordInterface} from './Agency/types';
import {AgencyClientAggregateIdInterface} from './AgencyClient/types';
import {AgencyCommandDataType} from './Agency/types/AgencyCommandDataType';
import {WriteProjectionInterface} from './WriteProjectionInterface';

// Might be worth having a UserEventMeta and SystemEventMeta concept
export interface EventMetaInterface {
  user_id: string;
  client_id?: string;
  context?: {
    type: string;
    id?: string;
  };
}

interface BaseEventInterface {
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

interface EventInterface<EventData, AggregateIdType> {
  type: string;
  aggregate_id: AggregateIdType;
  data: EventData;
  sequence_id: number;
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

/**
 * EventRepository
 *   Should the EventStore be passed in here?
 *   How would we handle snaphots? Pass a list of possible "stores"?
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
    private writeProjectionHandler: WriteProjectionInterface<EventData>,
    private eventMeta?: EventMetaInterface
  ) {}

  async leftFoldEventsDeprecated(
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

    const a = reduce(
      events,
      (acc: AggregateType, event: EventStoreDocumentType<AggregateIdType, EventData>) =>
        this.writeProjectionHandler.execute(event.type, acc, event),
      {last_sequence_id: 0}
    );

    return a;
  }

  async leftFoldEvents<AggregateIdType, EventDataType>(
    aggregateId: AggregateIdType,
    sequenceId: number = undefined
  ): Promise<BaseProjectionInterface> {
    const query: FilterQuery<EventStoreDocumentType> = {aggregate_id: aggregateId};

    if (sequenceId) {
      query['sequence_id'] = {$lte: sequenceId};
    }

    const events: EventStoreDocumentType<EventDataType, AggregateIdType>[] = await this.store
      .find(query)
      .sort({sequence_id: 1})
      .lean();

    const result = reduce(
      events,
      (aggregate, event) => WriteProjectionEventHandlerFactory.getHandler(event.type)(aggregate, event),
      {last_sequence_id: 0}
    );

    return result as BaseProjectionInterface;
  }

  /**
   * Persist events into event store collection
   */
  async save<EventDataType>(events: EventDataType[]): Promise<EventStoreDocumentType[]> {
    const enrichedEvents: (BaseEventInterface & EventDataType)[] = map(events, (aggEvent) => ({
      ...aggEvent,
      correlation_id: this.correlation_id,
      meta_data: this.eventMeta
    }));

    return this.store.insertMany(enrichedEvents);
  }
}
