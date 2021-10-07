import {reduce, map} from 'lodash';
import {FilterQuery, Model} from 'mongoose';
import {EventStoreDocumentType} from './models/EventStore';
import {WriteProjectionEventHandlerFactory} from './factories/WriteProjectionEventHandlerFactory';

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

interface BaseProjectionInterface {
  last_sequence_id: number;
}

/**
 * EventRepository
 *   Should the EventStore be passed in here?
 *   How would we handle snaphots? Pass a list of possible "stores"?
 *   How do we build snapshots in the background and use them when they are ready?
 */
export class EventRepository {
  constructor(
    private store: Model<EventStoreDocumentType>,
    private correlation_id: string,
    private eventMeta?: EventMetaInterface
  ) {}

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
